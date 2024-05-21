/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeConfig } from './JudgeConfig';

export type QuestionAddRequest = {
    after_code?: string;
    answer?: string;
    content?: string;
    judgeCase?: string;
    judgeConfig?: JudgeConfig;
    pre_code?: string;
    tags?: Array<string>;
    title?: string;
};
