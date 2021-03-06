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

/**
 * Uupload data to the DS.
 */
export class UploadBlobRequest {
    private dataHandle?: string;
    private billingTag?: string;
    private layerId?: string;
    private data?: ArrayBuffer | Buffer;
    private contentType?: string;
    private contentEncoding?: string;

    /**
     * Sets the content encoding of the data to upload.
     * 
     * Can be `gzip` or identity.
     * 
     * @param contentEncoding The content encoding of the data to upload.
     * 
     * @returns A reference to this object
     */
    public withContentEncoding(contentEncoding: string): UploadBlobRequest {
        this.contentEncoding = contentEncoding;
        return this;
    }

    /**
     * Gets the content encoding of the data to upload.
     * 
     * @returns The content encoding of the data to upload.
     */
    public getContentEncoding(): string | undefined {
        return this.contentEncoding;
    }

    /**
     * Sets the content type of the data to upload.
     * 
     * @param contentType the content type of the data to upload.
     * 
     * @returns A reference to this object
     */
    public withContentType(contentType: string): UploadBlobRequest {
        this.contentType = contentType;
        return this;
    }

    /**
     * Gets the content type of the data to upload.
     * 
     * @returns The content type of the data to upload.
     */
    public getContentType(): string | undefined {
        return this.contentType;
    }

    /**
     * Sets the data handle of the data to upload.
     * 
     * @param id the datahandle of the data to upload.
     * 
     * @returns A reference to this object
     */
    public withDataHandle(dataHandle: string): UploadBlobRequest {
        this.dataHandle = dataHandle;
        return this;
    }

    /**
     * Gets the data handle of the data to upload.
     * 
     * @returns The data handle of the data to upload.
     */
    public getDataHandle(): string | undefined {
        return this.dataHandle;
    }

    /**
     * Sets the ID of the layer.
     * 
     * @param id the ID of the layer.
     * 
     * @returns A reference to this object
     */
    public withLayerId(id: string): UploadBlobRequest {
        this.layerId = id;
        return this;
    }

    /**
     * Gets the ID of the layer.
     * 
     * @returns The ID of the layer.
     */
    public getLayerId(): string | undefined {
        return this.layerId;
    }

    /**
     * Sets the data to upload.
     * 
     * @param data The buffer of the data to upload.
     * 
     * @returns A reference to this object
     */
    public withData(data: ArrayBuffer | Buffer): UploadBlobRequest {
        this.data = data;
        return this;
    }

    /**
     * Gets the data (if it was set).
     * 
     * @return The data previously set or undefined.
     */
    public getData(): ArrayBuffer | Buffer | undefined {
        return this.data;
    }

    /**
     * Sets the billing tag.
     * 
     * @param tag The free-form tag that is used for grouping billing records together.
     * If supplied, it must be 4–16 characters long and contain only alphanumeric ASCII characters [A–Za–z0–9].
     * 
     * @returns A reference to this object.
     */
    public withBillingTag(tag: string): UploadBlobRequest {
        this.billingTag = tag;
        return this;
    }

    /**
     * Gets the billing tag (if it was set).
     * 
     * @return The billing tag or `undefined` if it was not set.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }
}
