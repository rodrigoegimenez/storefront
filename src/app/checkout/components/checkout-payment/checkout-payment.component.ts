import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AddPayment, GetOrderForCheckout, Maybe } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';
import { StateService } from '../../../core/providers/state/state.service';

import { ADD_PAYMENT, GET_ORDER_FOR_CHECKOUT } from './checkout-payment.graphql';

@Component({
    selector: 'vsf-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    styleUrls: ['./checkout-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent {
    cardNumber: string;
    expMonth: number;
    expYear: number;

    order: Maybe<GetOrderForCheckout.ActiveOrder>;
    paypal = true; // TODO: Get Payment Method from server

    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router,
                private route: ActivatedRoute) {
                    if (this.paypal) {
                        const activeOrder$ = this.dataService
                        .query<GetOrderForCheckout.Query>(GET_ORDER_FOR_CHECKOUT)
                        .pipe(map(data => data.activeOrder))
                        .subscribe(data => {
                            this.order = data;
                        });
                    }
                }

    getMonths(): number[] {
        return Array.from({ length: 12 }).map((_, i) => i + 1);
    }

    getYears(): number[] {
        const year = new Date().getFullYear();
        return Array.from({ length: 10 }).map((_, i) => year + i);
    }

    completeOrder() {
        let paymentDetails: {method: string, metadata: {}};
        if (this.paypal) {
            paymentDetails = {
                method: 'paypal',
                metadata: {
                    foo: 'bar', // Add order info here.
                },
            };
        } else {
            paymentDetails = {
                method: 'example-payment-provider',
                metadata: {
                    foo: 'bar',
                },
            };
        }
        this.dataService.mutate<AddPayment.Mutation, AddPayment.Variables>(ADD_PAYMENT, {
            input: paymentDetails,
        })
            .subscribe(async result => {
                const order = result.addPaymentToOrder;
                if (order && (order.state === 'PaymentSettled' || order.state === 'PaymentAuthorized')) {
                    await new Promise(resolve => setTimeout(() => {
                        this.stateService.setState('activeOrderId', null);
                        resolve();
                    }, 500));
                    this.router.navigate(['../confirmation', order.code], { relativeTo: this.route });
                }
            });
    }
}
