/* eslint-disable @typescript-eslint/indent */
import { ethers } from 'ethers'

export class Provider {
    constructor() {
    }

    private static _provider: ethers.BrowserProvider

    public static getProvider() {
        if (!Provider._provider)
            Provider._provider = new ethers.BrowserProvider(window.ethereum)
        return Provider._provider
    }
}
