import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Register } from '../../../common/generated-types';
import { DataService } from '../../../core/providers/data/data.service';

import { REGISTER } from './register.graphql';

@Component({
    selector: 'vsf-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
    requireVerification = false; // TODO: get requireVerification from server.

    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    registrationSent = false;
    constructor(private dataService: DataService,
                private changeDetector: ChangeDetectorRef) { }

    register() {
        this.dataService.mutate<Register.Mutation, Register.Variables>(REGISTER, {
            input: {
                emailAddress: this.emailAddress,
                firstName: this.firstName,
                lastName: this.lastName,
                password: this.password,
                },
            }).subscribe(() => {
            this.registrationSent = true;
            this.changeDetector.markForCheck();
        });
    }
}
