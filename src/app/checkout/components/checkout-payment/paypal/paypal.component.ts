import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { map, shareReplay, take } from 'rxjs/operators';
import { GetOrderForCheckout, Maybe } from 'src/app/common/generated-types';

import { DataService } from 'src/app/core/providers/data/data.service';

@Component({
  selector: 'vsf-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaypalComponent implements OnInit {
  @Input() order: Maybe<GetOrderForCheckout.ActiveOrder>;
    public payPalConfig?: IPayPalConfig;
    showError: boolean;
    showSuccess: boolean;
    showCancel: boolean;
    config: string;

    ngOnInit(): void {
        this.initConfig();
    }

    constructor(private dataService: DataService) {}

    private async initConfig(): Promise<void> {
        this.payPalConfig = {
            currency: this.order?.currencyCode,
            clientId: 'sb',
            createOrderOnClient: data => {
                console.log('CreateOrderOnClient');
                const items = this.order?.lines;
                const paypalItems = items?.map(item => {
                    return {
                        name: item.productVariant.name,
                        unit_amount: {
                            currency_code: this.order?.currencyCode,
                            value: (item.unitPriceWithTax / 100).toString()
                        },
                        quantity: item.quantity.toString(),
                        description: item.productVariant.name,
                        sku: item.productVariant.sku,
                        category: 'PHYSICAL_GOODS'
                    };
                });
                //console.log(this.order);
                console.log(paypalItems);
                const orderRequest = {
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: this.order!.currencyCode,
                                value: (this.order!.total / 100).toString(),
                                breakdown: {
                                    item_total: {
                                        currency_code: this.order!.currencyCode,
                                        value: (
                                            this.order!.subTotal / 100
                                        ).toString()
                                    },
                                    shipping: {
                                        currency_code: this.order!.currencyCode,
                                        value: (
                                            this.order!.shipping / 100
                                        ).toString()
                                    }
                                }
                            },
                            items: paypalItems,
                            shipping: {
                                name: {
                                    full_name: this.order?.shippingAddress?.fullName,
                                },
                                address: {
                                    address_line_1: this.order?.shippingAddress?.streetLine1,
                                    address_line_2: this.order?.shippingAddress?.streetLine2,
                                    admin_area_1: this.order?.shippingAddress?.province,
                                    admin_area_2: this.order?.shippingAddress?.city,
                                    country_code: this.order?.shippingAddress?.countryCode, // GET COUNTRY CODE FROM COUNTRY OBJECT!
                                    postal_code: this.order?.shippingAddress?.postalCode,
                                }
                            }
                        }
                    ]
                } as ICreateOrderRequest;
                console.log(orderRequest);
                return orderRequest;
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'vertical'
            },
            onApprove: (data, actions) => {
                console.log(
                    'onApprove - transaction was approved, but not authorized',
                    data,
                    actions
                );
                actions.order.get().then((details: any) => {
                    console.log(
                        'onApprove - you can get full order details inside onApprove: ',
                        details
                    );
                });
            },
            onClientAuthorization: data => {
                console.log(
                    'onClientAuthorization - you should probably inform your server about completed transaction at this point',
                    data
                );
                this.showSuccess = true;
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
                this.showCancel = true;
            },
            onError: err => {
                console.log('OnError', err);
                this.showError = true;
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
                this.resetStatus();
            }
        };
    
      console.log(this.order);
      }
    resetStatus() {}
}
