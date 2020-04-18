import gql from "graphql-tag";

import {
    CART_FRAGMENT,
    ORDER_ADDRESS_FRAGMENT,
} from "../../../common/graphql/fragments.graphql";

export const ADD_PAYMENT = gql`
    mutation AddPayment($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            ...Cart
        }
    }
    ${CART_FRAGMENT}
`;

export const GET_ORDER_FOR_CHECKOUT = gql`
    query GetOrderForPayment {
        activeOrder {
            ...Cart
            shippingAddress {
                ...OrderAddress
            }
        }
    }
    ${CART_FRAGMENT}
    ${ORDER_ADDRESS_FRAGMENT}
`;
