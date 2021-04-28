# CalculatorIOS
###### Höfundur: Guðmundur Garðar Árnasson (gardar39@gmail.com)

## Uppsetning verkefnis

#### Umhverfi
Best er að fylgja leiðbeiningum varðandi hvaða environment packages þarf að niðurhala frá [React Native](https://reactnative.dev/docs/environment-setup)

Fyrir iOS er best að ná í `xcode` or setja upp einhvern iOS simulator. Ég notaði iphone12 með iOS 14.4.

Fyrir android mæli ég með að notast við android studio og ná í android simulator.


Einnig er hægt að keyra verkefnið á eigin síma með með því að virkja 'USB debug mode' og tengja við tölvu.

Hægt er að keyra `adb devices` og skoða alla simulator-a sem eru í boði fyrir android.

#### Keyra verkefnið

Í rót verkefnisins skal keyra `yarn install` og niðurhala node pökkum.

Fyrir iOS:
 - Úr rót skal fara í  /ios möppu og keyra:
```
pod install
```
Ef pod command finnst ekki, þarf að ná í `cocoapods`

- Næst skal fara aftur í rótina, splitta upp terminal í tvo glugga. Keyra fyrst `yarn start` í öðrum, og svo `yarn ios` í hinum.

Fyrir android: 
- Passið að þið séuð með `ANDROID_SDK_ROOT` rétt sett upp í environmental variables.
- Næst skal svo gera eins og fyrir ofan: splitta upp terminal í tvo glugga. Keyra fyrst `yarn start` í öðrum, og svo `yarn android` í hinum.

## Virkni

Sem fyrirmynd notaði ég IOS reiknivélina með 14.4.2 iOS á iPhone 11 pro.

Helsta virkni er eins og búist er við af reiknivél, en mig langar til þess að segja aðeins frá minna augljósri virkni.

- Eftir að hafa klárað útreikning með '=' takkanum er hægt að smella á hann aftur til þess að endurtaka sama útreikning aftur. T.d. `2 + 3 = =` mun leggja 3 saman við 2 tvisvar og gefa útkomuna 8.

- Til þess að fljótlega reikna á sömu tölu `(t.d. 3+3)` þá er hægt að smella á töluna, operatorinn og svo beint á '=' takkann. Einnig er hægt að smella aftur á '=' merkið hér til þess að endurtaka fyrri útreikninga. `3 * = = mun gefa 3*3*3 = 27`
- Þegar maður gerir prentvillu við að skrifa inn tölu, þá er hægt að swipe-a til hægri eða vinstri til að stroka út síðasta innslátt. (Þetta er einnig virkni í venjulegu iOS reiknivélinni).
- Það komast einungis fyrir 9 tölur á skjánum. Ef talan verður of stór er hún skrifuð með x,x\*e^y rithætti. Ef talan er of lítil, þá er hún skrifuð með x,x\*e^-y.

Tölur í javascript eru skrifaðar með öðruvísi rithætti sjálfkrafa þegar þær verða óþarflega stórar. Þetta verður til þess að ef veldisvísir e fer yfir 20, þá birtist það ekki rétt á skjánum. 



