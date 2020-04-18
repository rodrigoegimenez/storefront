import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPayPalModule } from 'ngx-paypal';

import { SharedModule } from '../shared/shared.module';

import { routes } from './checkout.routes';
import { CheckoutConfirmationComponent } from './components/checkout-confirmation/checkout-confirmation.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { PaypalComponent } from './components/checkout-payment/paypal/paypal.component';
import { CheckoutProcessComponent } from './components/checkout-process/checkout-process.component';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutSignInComponent } from './components/checkout-sign-in/checkout-sign-in.component';
import { CheckoutStageIndicatorComponent } from './components/checkout-stage-indicator/checkout-stage-indicator.component';

const DECLARATIONS = [
    CheckoutConfirmationComponent,
    CheckoutPaymentComponent,
    CheckoutShippingComponent,
    CheckoutSignInComponent,
    CheckoutProcessComponent,
    CheckoutStageIndicatorComponent,
    PaypalComponent,
];

@NgModule({
    declarations: DECLARATIONS,
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        NgxPayPalModule,
    ],
})
export class CheckoutModule {
}
