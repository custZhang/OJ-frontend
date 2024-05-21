/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AiControllerService {

    /**
     * getAfterCode
     * @param content content
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static getAfterCodeUsingPost(
content: string,
): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/getAfterCode',
            body: content,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getAnswer
     * @param content content
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static getAnswerUsingPost(
content: string,
): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/getAnswer',
            body: content,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getJudgeCase
     * @param content content
     * @param number number
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static getJudgeCaseUsingPost(
content: string,
number?: number,
): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/getJudgeCase',
            query: {
                'number': number,
            },
            body: content,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getPreCode
     * @param content content
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static getPreCodeUsingPost(
content: string,
): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/getPreCode',
            body: content,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getTip
     * @param content content
     * @returns string OK
     * @returns any Created
     * @throws ApiError
     */
    public static getTipUsingPost(
content: string,
): CancelablePromise<string | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/ai/getTip',
            body: content,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * aiStatus
     * @param status status
     * @returns string OK
     * @throws ApiError
     */
    public static aiStatusUsingGet(
status: boolean,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/ai/status',
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
