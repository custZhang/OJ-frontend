/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeConfig } from './JudgeConfig';

export type QuestionUpdateRequest = {
    after_code?: string;
    answer?: string;
    content?: string;
    id?: number;
    judgeCase?: string;
    judgeConfig?: JudgeConfig;
    pre_code?: string;
    tags?: Array<string>;
    title?: string;
};
