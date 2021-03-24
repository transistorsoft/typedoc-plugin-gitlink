import * as ts from 'typescript';
import * as Path from 'path'
import * as FS from 'fs-extra'
import { Component, ConverterComponent } from 'typedoc/dist/lib/converter/components';
import {Converter} from 'typedoc/dist/lib/converter/converter'
import {Context} from 'typedoc/dist/lib/converter/context'
import {SourceReference} from 'typedoc/dist/lib/models/sources/file'
import {Options} from 'typedoc/dist/lib/utils/options/options'


@Component({name: 'gitlink'})
export class GitLinkPlugin extends ConverterComponent {
    static PATTERN = '\[(.*)\]\(github:([a-zA-Z\/?\-?]+)\)';

    private re: RegExp;

    public initialize(): void {
        this.re = new RegExp(GitLinkPlugin.PATTERN, 'igm');

        this.listenTo(this.owner, Converter.EVENT_BEGIN, this.onBegin)
    }

    private onBegin(): void {
        // read options parameter
        const options: Options = this.application.options

        try {
            // register handler
            this.listenTo(this.owner, Converter.EVENT_RESOLVE_END, this.onEndResolve)
        }
        catch ( e ) {
            console.error('typedoc-plugin-sourcefile-url: ' + e.message)
        }
    }

    private onEndResolve(context: Context): void {
        const project = context.project
        let url = project.packageInfo.repository.url.split('/');
        let repo = url.pop().split('.').shift();
        let username = url.pop();

        for ( let key in project.reflections ) {
            const reflection = project.reflections[key];
            if (reflection.comment) {
                let replacement = '(https://github.com/' + username + '/' + repo + '/$2';
                if (this.re.test(reflection.comment.shortText)) {
                    reflection.comment.shortText = reflection.comment.shortText.replace(this.re, replacement);
                }
                if (this.re.test(reflection.comment.text)) {
                    reflection.comment.text = reflection.comment.text.replace(this.re, replacement);
                }
                if (reflection.comment.tags) {
                    reflection.comment.tags.forEach(tag => {
                        if (this.re.test(tag.text)) {
                            tag.text = tag.text.replace(this.re, replacement);
                        }
                    });
                }
            }
        }
    }
}