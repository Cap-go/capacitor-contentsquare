/**
 * Internal native bridge contract implemented by Capacitor.
 */
export interface ContentsquareNativePlugin {
    optIn(): Promise<void>;
    optOut(): Promise<void>;
    sendScreenName(options: {
        name: string;
    }): Promise<void>;
    sendTransaction(transactionItem: TransactionItem): Promise<void>;
    sendDynamicVarWithStringValue(dynamicVarItem: DynamicVarItem): Promise<void>;
    sendDynamicVarWithIntValue(dynamicVarItem: DynamicVarItem): Promise<void>;
    onReady(): Promise<void>;
    excludeURLForReplay(options: {
        url: string;
    }): Promise<void>;
    setPIISelectors(pii: PIIConfig): Promise<void>;
    setCapturedElementsSelector(options: {
        elements: string;
    }): Promise<void>;
    collect(telemetryItem: TelemetryItem): Promise<void>;
}
/**
 * Selector and attribute masking configuration for Session Replay.
 */
export interface PIIConfig {
    /**
     * CSS selectors whose content must be masked.
     */
    PIISelectors: string[];
    /**
     * Attribute masking rules for specific selectors.
     */
    Attributes: PIIAttribute[];
}
/**
 * Attribute masking rule used by `setPIISelectors`.
 */
export interface PIIAttribute {
    /**
     * CSS selector to match.
     */
    selector: string;
    /**
     * Attribute name or names to mask for matching elements.
     */
    attrName: string | string[];
}
/**
 * Dynamic variable payload.
 */
export interface DynamicVarItem {
    /**
     * Contentsquare dynamic variable key.
     */
    dynVarKey: string;
    /**
     * Dynamic variable value.
     *
     * Use either a string or a non-negative integer.
     */
    dynVarValue: string | number;
}
/**
 * Transaction payload sent to Contentsquare.
 */
export interface TransactionItem {
    /**
     * Transaction value.
     */
    transactionValue: number;
    /**
     * ISO 4217 currency code.
     */
    transactionCurrency: CurrencyCode | string;
    /**
     * Optional transaction identifier.
     */
    transactionId?: string;
}
/**
 * Internal telemetry payload.
 */
export interface TelemetryItem {
    /**
     * Telemetry key.
     */
    name: string;
    /**
     * Telemetry value.
     */
    value: string;
}
/**
 * Public Contentsquare API for Capacitor applications.
 */
export interface ContentsquarePlugin {
    /**
     * Marks the user as opted in and starts tracking.
     */
    optIn(): Promise<void>;
    /**
     * Stops tracking, clears local Contentsquare state, and opts the user out.
     */
    optOut(): Promise<void>;
    /**
     * Sends a screenview event for the current screen.
     */
    sendScreenName(name: string): Promise<void>;
    /**
     * Sends a transaction to Contentsquare.
     */
    sendTransaction(transactionItem: TransactionItem): Promise<void>;
    /**
     * Sends a dynamic variable.
     *
     * The value must be either a string or a non-negative integer.
     */
    sendDynamicVar(dynamicVarItem: DynamicVarItem): Promise<void>;
    /**
     * Excludes URLs matching the provided JavaScript regular expression literal from Session Replay.
     *
     * Example: `"/checkout/"`.
     */
    excludeURLForReplay(url: string): Promise<void>;
    /**
     * Applies Session Replay masking rules to specific selectors and attributes.
     */
    setPIISelectors(pii: PIIConfig): Promise<void>;
    /**
     * Allows specific elements to be captured even when the current page is masked.
     */
    setCapturedElementsSelector(elements: string): Promise<void>;
}
export declare const enum CurrencyCode {
    USD = "USD",
    CAD = "CAD",
    EUR = "EUR",
    AED = "AED",
    AFN = "AFN",
    ALL = "ALL",
    AMD = "AMD",
    ARS = "ARS",
    AUD = "AUD",
    AZN = "AZN",
    BAM = "BAM",
    BDT = "BDT",
    BGN = "BGN",
    BHD = "BHD",
    BIF = "BIF",
    BND = "BND",
    BOB = "BOB",
    BRL = "BRL",
    BWP = "BWP",
    BYN = "BYN",
    BZD = "BZD",
    CDF = "CDF",
    CHF = "CHF",
    CLP = "CLP",
    CNY = "CNY",
    COP = "COP",
    CRC = "CRC",
    CVE = "CVE",
    CZK = "CZK",
    DJF = "DJF",
    DKK = "DKK",
    DOP = "DOP",
    DZD = "DZD",
    EEK = "EEK",
    EGP = "EGP",
    ERN = "ERN",
    ETB = "ETB",
    GBP = "GBP",
    GEL = "GEL",
    GHS = "GHS",
    GNF = "GNF",
    GTQ = "GTQ",
    HKD = "HKD",
    HNL = "HNL",
    HRK = "HRK",
    HUF = "HUF",
    IDR = "IDR",
    ILS = "ILS",
    INR = "INR",
    IQD = "IQD",
    IRR = "IRR",
    ISK = "ISK",
    JMD = "JMD",
    JOD = "JOD",
    JPY = "JPY",
    KES = "KES",
    KHR = "KHR",
    KMF = "KMF",
    KRW = "KRW",
    KWD = "KWD",
    KZT = "KZT",
    LBP = "LBP",
    LKR = "LKR",
    LTL = "LTL",
    LVL = "LVL",
    LYD = "LYD",
    MAD = "MAD",
    MDL = "MDL",
    MGA = "MGA",
    MKD = "MKD",
    MMK = "MMK",
    MOP = "MOP",
    MUR = "MUR",
    MXN = "MXN",
    MYR = "MYR",
    MZN = "MZN",
    NAD = "NAD",
    NGN = "NGN",
    NIO = "NIO",
    NOK = "NOK",
    NPR = "NPR",
    NZD = "NZD",
    OMR = "OMR",
    PAB = "PAB",
    PEN = "PEN",
    PHP = "PHP",
    PKR = "PKR",
    PLN = "PLN",
    PYG = "PYG",
    QAR = "QAR",
    RON = "RON",
    RSD = "RSD",
    RUB = "RUB",
    RWF = "RWF",
    SAR = "SAR",
    SDG = "SDG",
    SEK = "SEK",
    SGD = "SGD",
    SOS = "SOS",
    SYP = "SYP",
    THB = "THB",
    TND = "TND",
    TOP = "TOP",
    TRY = "TRY",
    TTD = "TTD",
    TWD = "TWD",
    TZS = "TZS",
    UAH = "UAH",
    UGX = "UGX",
    UYU = "UYU",
    UZS = "UZS",
    VEF = "VEF",
    VND = "VND",
    XAF = "XAF",
    XOF = "XOF",
    YER = "YER",
    ZAR = "ZAR",
    ZMK = "ZMK",
    ZWL = "ZWL"
}
