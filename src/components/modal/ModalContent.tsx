import React, { useCallback, useState } from 'react';
import { currencies, todaysDate } from '../../helpers/Utils';
import { FormValues } from '../../interface';
import { Label } from '../form';
import FormInput from '../form/FormInput';
import { CalendarIcon } from '../svg';

const ModalContent = (): React.ReactElement => {
    const initialValues = { title: '', purchaseDate: todaysDate(), currency: '', amount: '' } as FormValues;
    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState<FormValues>({} as FormValues);

    // validate the form fields
    // always returns a memoised callback of the updated function to 
    // avoid uncessary re-rendering and flickering
    const validateFormField = useCallback((fieldName: string, value: string) => {
        // initital error message for valid fields
        let errorMessage = "";
        if (fieldName === "title") {
            // checks if the value is not empty and greater than 5
            if (!value || value.length < 5) {
                errorMessage = "Title must be 5 characters long"
                setIsFormValid(false);
            } else {
                setIsFormValid(true);
            }
            // update error message for the field
            setErrors({ ...errors, title: errorMessage })

        } else if (fieldName === "amount") {
            // checks if the field value is not empty and type is a number
            if (!value && typeof value !== 'number') {
                setIsFormValid(false);
                errorMessage = 'Only numbers allowed'
                // check if value is less than 0
            } else if (parseInt(value) < 0) {
                setIsFormValid(false);
                errorMessage = 'Amount should be a positive integer'
            } else {
                setIsFormValid(true);
            }

            setErrors({ ...errors, amount: errorMessage })

        } else if (fieldName === 'currency') {
            // checks if field value is not empty
            if (!value) {
                setIsFormValid(false);
                errorMessage = "Select currency"
            } else {
                setIsFormValid(true);
            }
            setErrors({ ...errors, currency: errorMessage })

        } else if (fieldName === 'purchaseDate') {
            // create an instance of the date class using the date value from the field
            const date = new Date(value);
            // check if date is of type Date and valid
            if (!(date instanceof Date && !isNaN(date.valueOf()))) {
                setIsFormValid(false);
                errorMessage = "Invalid date"
            } else {
                setIsFormValid(true);
            }
            setErrors({ ...errors, purchaseDate: errorMessage })
        }


    }, [errors])

    // update form values and validate form field
    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;

        // set form value based on the current field and value
        setFormValues({ ...formValues, [name]: value })

        // validate the fields
        validateFormField(name, value);

    }, [formValues, validateFormField]);

    return (
        <div className="modal-content">
            <form name="testForm">
                {/* title */}
                <div className="form-title">
                    <Label text="Title" />
                    {!isFormValid && (
                        <small className="error-message">{errors.title}</small>
                    )}
                    <FormInput
                        name="title"
                        placeholder="Expense Title"
                        required
                        className="input-text"
                        handleChange={handleChange} 
                    />
                </div>
                {/* purchase date */}
                <div className="form-purchase-date">
                    <Label text="Purchase Date" />
                    {!isFormValid && (
                        <small className="error-message">{errors.purchaseDate}</small>
                    )}
                    <div className="input-date-picker">
                        <FormInput name="purchaseDate"
                            required
                            type="date"
                            value={formValues.purchaseDate}
                            handleChange={handleChange}
                        />
                        <CalendarIcon className="calendar-icon" />
                    </div>
                </div>
                {/* currency selection */}
                <div className="form-currency">
                    {!isFormValid && (
                        <small className="error-message">{errors.currency}</small>
                    )}
                    <div className="flex-row">
                        <Label text="Currency" className="float-right" />
                        <select className="select" name="currency" onChange={handleChange}>
                            <option value=""> </option>
                            {
                                currencies.map((currency: string, index: number) => {
                                    return (
                                        <option value={`${currency.toLowerCase()}`} key={index}>
                                            {currency}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                {/* total amount */}
                <div className="form-amount">
                    <Label text="Amount" />
                    {!isFormValid && (
                        <small className="error-message">{errors.amount}</small>
                    )}
                    <FormInput
                        name="amount"
                        placeholder="Total Amount"
                        required
                        className="input-text"
                        type="number"
                        handleChange={handleChange}
                    />
                </div>
            </form>
        </div>
    )
};

export default ModalContent;