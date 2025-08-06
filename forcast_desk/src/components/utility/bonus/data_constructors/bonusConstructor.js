// Bonus Data Constructor

import { PayrollDataConstructor } from '@/components/utility/payroll/data_constructors/payrollDataConstructor.js';

export class BonusDataConstructor extends PayrollDataConstructor {
    constructor() {
        super();

        // this is bonus field
        this.bonusFields = {
            bonus: {
                payroll_unique_id: null,
                fields: ['bonus']
            }
        }
    }
}

