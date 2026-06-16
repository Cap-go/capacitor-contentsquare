# @capgo/capacitor-contentsquare
<a href="https://capgo.app/"><img src="https://capgo.app/readme-banner.svg?repo=Cap-go/capacitor-contentsquare" alt="Capgo - Instant updates for Capacitor" /></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_contentsquare"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_contentsquare"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>

Capacitor 8 wrapper for the official Contentsquare mobile SDKs.

This package keeps the official Contentsquare Capacitor API shape while updating the plugin packaging for Capacitor 8, Swift Package Manager, and Capgo's standard plugin template.

## Documentation

The upstream product documentation is available at [docs.contentsquare.com/en/capacitor/](https://docs.contentsquare.com/en/capacitor/).

## Compatibility

| Plugin version | Capacitor compatibility | Native iOS SDK | Native Android SDK |
| -------------- | ----------------------- | -------------- | ------------------ |
| v8.*.*         | v8.*.*                  | 4.45.4         | 4.43.3             |

This is a community Capacitor 8 port. Contentsquare's official package currently targets Capacitor 7, but the documented API surface remains the same.

## Install

You can use our AI-Assisted Setup to install the plugin. Add the Capgo skills to your AI tool using the following command:

```bash
npx skills add https://github.com/cap-go/capacitor-skills --skill capacitor-plugins
```

Then use the following prompt:

```text
Use the `capacitor-plugins` skill from `cap-go/capacitor-skills` to install the `@capgo/capacitor-contentsquare` plugin in my project.
```

If you prefer Manual Setup, install the plugin by running the following commands and follow the platform-specific instructions below:

```bash
bun add @capgo/capacitor-contentsquare
bunx cap sync
```

## Usage

```ts
import { ContentsquarePlugin, CurrencyCode } from '@capgo/capacitor-contentsquare';

await ContentsquarePlugin.optIn();

await ContentsquarePlugin.sendScreenName('Home');

await ContentsquarePlugin.sendTransaction({
  transactionValue: 10,
  transactionCurrency: CurrencyCode.EUR,
  transactionId: 'order-42',
});

await ContentsquarePlugin.sendDynamicVar({
  dynVarKey: 'store',
  dynVarValue: 'rome',
});
```

## iOS Setup

To enable Contentsquare in-app features on iOS, your host app still needs the upstream deeplink wiring described in the official docs:

1. Add the `cs-$(PRODUCT_BUNDLE_IDENTIFIER)` URL scheme to the app.
2. Forward incoming Contentsquare URLs with `Contentsquare.handle(url: url)` from your `AppDelegate`, `SceneDelegate`, or SwiftUI `onOpenURL`.

## API

<docgen-index>

* [`optIn()`](#optin)
* [`optOut()`](#optout)
* [`sendScreenName(...)`](#sendscreenname)
* [`sendTransaction(...)`](#sendtransaction)
* [`sendDynamicVar(...)`](#senddynamicvar)
* [`excludeURLForReplay(...)`](#excludeurlforreplay)
* [`setPIISelectors(...)`](#setpiiselectors)
* [`setCapturedElementsSelector(...)`](#setcapturedelementsselector)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Public Contentsquare API for Capacitor applications.

### optIn()

```typescript
optIn() => Promise<void>
```

Marks the user as opted in and starts tracking.

--------------------


### optOut()

```typescript
optOut() => Promise<void>
```

Stops tracking, clears local Contentsquare state, and opts the user out.

--------------------


### sendScreenName(...)

```typescript
sendScreenName(name: string) => Promise<void>
```

Sends a screenview event for the current screen.

| Param      | Type                |
| ---------- | ------------------- |
| **`name`** | <code>string</code> |

--------------------


### sendTransaction(...)

```typescript
sendTransaction(transactionItem: TransactionItem) => Promise<void>
```

Sends a transaction to Contentsquare.

| Param                 | Type                                                        |
| --------------------- | ----------------------------------------------------------- |
| **`transactionItem`** | <code><a href="#transactionitem">TransactionItem</a></code> |

--------------------


### sendDynamicVar(...)

```typescript
sendDynamicVar(dynamicVarItem: DynamicVarItem) => Promise<void>
```

Sends a dynamic variable.

The value must be either a string or a non-negative integer.

| Param                | Type                                                      |
| -------------------- | --------------------------------------------------------- |
| **`dynamicVarItem`** | <code><a href="#dynamicvaritem">DynamicVarItem</a></code> |

--------------------


### excludeURLForReplay(...)

```typescript
excludeURLForReplay(url: string) => Promise<void>
```

Excludes URLs matching the provided JavaScript regular expression literal from Session Replay.

Example: `"/checkout/"`.

| Param     | Type                |
| --------- | ------------------- |
| **`url`** | <code>string</code> |

--------------------


### setPIISelectors(...)

```typescript
setPIISelectors(pii: PIIConfig) => Promise<void>
```

Applies Session Replay masking rules to specific selectors and attributes.

| Param     | Type                                            |
| --------- | ----------------------------------------------- |
| **`pii`** | <code><a href="#piiconfig">PIIConfig</a></code> |

--------------------


### setCapturedElementsSelector(...)

```typescript
setCapturedElementsSelector(elements: string) => Promise<void>
```

Allows specific elements to be captured even when the current page is masked.

| Param          | Type                |
| -------------- | ------------------- |
| **`elements`** | <code>string</code> |

--------------------


### Interfaces


#### TransactionItem

Transaction payload sent to Contentsquare.

| Prop                      | Type                | Description                      |
| ------------------------- | ------------------- | -------------------------------- |
| **`transactionValue`**    | <code>number</code> | Transaction value.               |
| **`transactionCurrency`** | <code>string</code> | ISO 4217 currency code.          |
| **`transactionId`**       | <code>string</code> | Optional transaction identifier. |


#### DynamicVarItem

Dynamic variable payload.

| Prop              | Type                          | Description                                                            |
| ----------------- | ----------------------------- | ---------------------------------------------------------------------- |
| **`dynVarKey`**   | <code>string</code>           | Contentsquare dynamic variable key.                                    |
| **`dynVarValue`** | <code>string \| number</code> | Dynamic variable value. Use either a string or a non-negative integer. |


#### PIIConfig

Selector and attribute masking configuration for Session Replay.

| Prop               | Type                        | Description                                     |
| ------------------ | --------------------------- | ----------------------------------------------- |
| **`PIISelectors`** | <code>string[]</code>       | CSS selectors whose content must be masked.     |
| **`Attributes`**   | <code>PIIAttribute[]</code> | Attribute masking rules for specific selectors. |


#### PIIAttribute

Attribute masking rule used by `setPIISelectors`.

| Prop           | Type                            | Description                                            |
| -------------- | ------------------------------- | ------------------------------------------------------ |
| **`selector`** | <code>string</code>             | CSS selector to match.                                 |
| **`attrName`** | <code>string \| string[]</code> | Attribute name or names to mask for matching elements. |


### Enums


#### CurrencyCode

| Members   | Value              |
| --------- | ------------------ |
| **`USD`** | <code>'USD'</code> |
| **`CAD`** | <code>'CAD'</code> |
| **`EUR`** | <code>'EUR'</code> |
| **`AED`** | <code>'AED'</code> |
| **`AFN`** | <code>'AFN'</code> |
| **`ALL`** | <code>'ALL'</code> |
| **`AMD`** | <code>'AMD'</code> |
| **`ARS`** | <code>'ARS'</code> |
| **`AUD`** | <code>'AUD'</code> |
| **`AZN`** | <code>'AZN'</code> |
| **`BAM`** | <code>'BAM'</code> |
| **`BDT`** | <code>'BDT'</code> |
| **`BGN`** | <code>'BGN'</code> |
| **`BHD`** | <code>'BHD'</code> |
| **`BIF`** | <code>'BIF'</code> |
| **`BND`** | <code>'BND'</code> |
| **`BOB`** | <code>'BOB'</code> |
| **`BRL`** | <code>'BRL'</code> |
| **`BWP`** | <code>'BWP'</code> |
| **`BYN`** | <code>'BYN'</code> |
| **`BZD`** | <code>'BZD'</code> |
| **`CDF`** | <code>'CDF'</code> |
| **`CHF`** | <code>'CHF'</code> |
| **`CLP`** | <code>'CLP'</code> |
| **`CNY`** | <code>'CNY'</code> |
| **`COP`** | <code>'COP'</code> |
| **`CRC`** | <code>'CRC'</code> |
| **`CVE`** | <code>'CVE'</code> |
| **`CZK`** | <code>'CZK'</code> |
| **`DJF`** | <code>'DJF'</code> |
| **`DKK`** | <code>'DKK'</code> |
| **`DOP`** | <code>'DOP'</code> |
| **`DZD`** | <code>'DZD'</code> |
| **`EEK`** | <code>'EEK'</code> |
| **`EGP`** | <code>'EGP'</code> |
| **`ERN`** | <code>'ERN'</code> |
| **`ETB`** | <code>'ETB'</code> |
| **`GBP`** | <code>'GBP'</code> |
| **`GEL`** | <code>'GEL'</code> |
| **`GHS`** | <code>'GHS'</code> |
| **`GNF`** | <code>'GNF'</code> |
| **`GTQ`** | <code>'GTQ'</code> |
| **`HKD`** | <code>'HKD'</code> |
| **`HNL`** | <code>'HNL'</code> |
| **`HRK`** | <code>'HRK'</code> |
| **`HUF`** | <code>'HUF'</code> |
| **`IDR`** | <code>'IDR'</code> |
| **`ILS`** | <code>'ILS'</code> |
| **`INR`** | <code>'INR'</code> |
| **`IQD`** | <code>'IQD'</code> |
| **`IRR`** | <code>'IRR'</code> |
| **`ISK`** | <code>'ISK'</code> |
| **`JMD`** | <code>'JMD'</code> |
| **`JOD`** | <code>'JOD'</code> |
| **`JPY`** | <code>'JPY'</code> |
| **`KES`** | <code>'KES'</code> |
| **`KHR`** | <code>'KHR'</code> |
| **`KMF`** | <code>'KMF'</code> |
| **`KRW`** | <code>'KRW'</code> |
| **`KWD`** | <code>'KWD'</code> |
| **`KZT`** | <code>'KZT'</code> |
| **`LBP`** | <code>'LBP'</code> |
| **`LKR`** | <code>'LKR'</code> |
| **`LTL`** | <code>'LTL'</code> |
| **`LVL`** | <code>'LVL'</code> |
| **`LYD`** | <code>'LYD'</code> |
| **`MAD`** | <code>'MAD'</code> |
| **`MDL`** | <code>'MDL'</code> |
| **`MGA`** | <code>'MGA'</code> |
| **`MKD`** | <code>'MKD'</code> |
| **`MMK`** | <code>'MMK'</code> |
| **`MOP`** | <code>'MOP'</code> |
| **`MUR`** | <code>'MUR'</code> |
| **`MXN`** | <code>'MXN'</code> |
| **`MYR`** | <code>'MYR'</code> |
| **`MZN`** | <code>'MZN'</code> |
| **`NAD`** | <code>'NAD'</code> |
| **`NGN`** | <code>'NGN'</code> |
| **`NIO`** | <code>'NIO'</code> |
| **`NOK`** | <code>'NOK'</code> |
| **`NPR`** | <code>'NPR'</code> |
| **`NZD`** | <code>'NZD'</code> |
| **`OMR`** | <code>'OMR'</code> |
| **`PAB`** | <code>'PAB'</code> |
| **`PEN`** | <code>'PEN'</code> |
| **`PHP`** | <code>'PHP'</code> |
| **`PKR`** | <code>'PKR'</code> |
| **`PLN`** | <code>'PLN'</code> |
| **`PYG`** | <code>'PYG'</code> |
| **`QAR`** | <code>'QAR'</code> |
| **`RON`** | <code>'RON'</code> |
| **`RSD`** | <code>'RSD'</code> |
| **`RUB`** | <code>'RUB'</code> |
| **`RWF`** | <code>'RWF'</code> |
| **`SAR`** | <code>'SAR'</code> |
| **`SDG`** | <code>'SDG'</code> |
| **`SEK`** | <code>'SEK'</code> |
| **`SGD`** | <code>'SGD'</code> |
| **`SOS`** | <code>'SOS'</code> |
| **`SYP`** | <code>'SYP'</code> |
| **`THB`** | <code>'THB'</code> |
| **`TND`** | <code>'TND'</code> |
| **`TOP`** | <code>'TOP'</code> |
| **`TRY`** | <code>'TRY'</code> |
| **`TTD`** | <code>'TTD'</code> |
| **`TWD`** | <code>'TWD'</code> |
| **`TZS`** | <code>'TZS'</code> |
| **`UAH`** | <code>'UAH'</code> |
| **`UGX`** | <code>'UGX'</code> |
| **`UYU`** | <code>'UYU'</code> |
| **`UZS`** | <code>'UZS'</code> |
| **`VEF`** | <code>'VEF'</code> |
| **`VND`** | <code>'VND'</code> |
| **`XAF`** | <code>'XAF'</code> |
| **`XOF`** | <code>'XOF'</code> |
| **`YER`** | <code>'YER'</code> |
| **`ZAR`** | <code>'ZAR'</code> |
| **`ZMK`** | <code>'ZMK'</code> |
| **`ZWL`** | <code>'ZWL'</code> |

</docgen-api>
