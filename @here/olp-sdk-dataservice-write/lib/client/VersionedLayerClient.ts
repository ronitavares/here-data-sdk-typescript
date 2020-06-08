/*
 * Copyright (C) 2020 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

import { HRN, OlpClientSettings, RequestFactory } from "@here/olp-sdk-core";
import { MetadataApi, PublishApi } from "@here/olp-sdk-dataservice-api";
import { StartBatchRequest } from "@here/olp-sdk-dataservice-write";

/**
 * Parameters for use to initialize VolatileLayerClient.
 */
export interface VersionedLayerClientParams {
    // [[HRN]] instance of the catalog hrn.
    catalogHrn: HRN;
    // The [[OlpClientSettings]] instance.
    settings: OlpClientSettings;
}

/**
 * Describes a versioned layer and provides the possibility to push the data to the versioned layers.
 */
export class VersionedLayerClient {
    private readonly apiVersion = "v1";

    /**
     * Creates the [[VersionedLayerClient]] instance with VersionedLayerClientParams.
     *
     * @param params parameters for use to initialize VersionedLayerClient.
     */
    constructor(private readonly params: VersionedLayerClientParams) {}

    /**
     * Gets the latest version of a catalog.
     *
     * The default value is -1. By convention -1 indicates the virtual initial version before
     * the first publication that has version 0.
     *
     * @param billingTag An optional free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4&ndash;16 characters long and contain only alphanumeric ASCII characters [A-Za-z0-9].
     *
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     *
     * @returns A promise of the HTTP response that contains the payload with the latest version.
     */
    public async getBaseVersion(
        billingTag?: string,
        abortSignal?: AbortSignal
    ): Promise<number> {
        const startVersion = -1;

        const builder = await RequestFactory.create(
            "metadata",
            this.apiVersion,
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                `Error retrieving from cache builder for resource "${this.params.catalogHrn}" 
                and api: metadata.\n${err}"`
            )
        );

        const latestVersion = await MetadataApi.latestVersion(builder, {
            startVersion,
            billingTag
        }).catch(err => Promise.reject(err));

        return Promise.resolve(latestVersion.version);
    }

    /**
     * Initializes a new publication for publishing metadata.
     * Determines the publication type based on the provided layer IDs.
     * A publication can only consist of layer IDs that have the same layer type.
     * For example, you can have a publication for multiple layers of type versioned,
     * but you cannot have a single publication that publishes to both versioned and stream layers.
     *
     * In addition, you may only have one versioned publication in process at a time.
     * You cannot have multiple active publications to the same catalog for versioned layer types.
     * The request field versionDependencies is optional and is used for versioned layers to declare version dependencies.
     *
     * @param request details of the batch operation to start
     * @param abortSignal An optional signal object that allows you to communicate with a request (such as the `fetch` request)
     * and, if required, abort it using the `AbortController` object.
     *
     * For more information, see the [`AbortController` documentation](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     */
    public async startBatch(
        request: StartBatchRequest,
        abortSignal?: AbortSignal
    ) {
        const requestBuilder = await RequestFactory.create(
            "publish",
            "v2",
            this.params.settings,
            this.params.catalogHrn,
            abortSignal
        ).catch((err: Response) =>
            Promise.reject(
                new Error(
                    `Error retrieving from cache builder for resource "${this.params.catalogHrn}" and api: publish. ${err}`
                )
            )
        );

        const layerIds = request.getLayers();
        if (!layerIds) {
            return Promise.reject(
                new Error(
                    "Please provide layer id or ids for the StartBatchRequest"
                )
            );
        }

        return PublishApi.initPublication(requestBuilder, {
            body: {
                layerIds,
                versionDependencies: request.getVersionDependencies()
            },
            billingTag: request.getBillingTag()
        });
    }
}