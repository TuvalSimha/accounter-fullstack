create or replace function insert_creditcard_transaction_into_merged_table()
    RETURNS trigger AS
$$
BEGIN

    if (NEW.full_supplier_name_outbound <> 'TOTAL FOR DATE' OR
        NEW.full_supplier_name_outbound IS NULL)
        AND (NEW.full_supplier_name_outbound <> 'CASH ADVANCE FEE' OR
             NEW.full_supplier_name_outbound IS NULL)
        AND (NEW.supplier_name <> 'סך חיוב בש"ח:' OR
             NEW.supplier_name IS NULL) then

        INSERT INTO accounter_schema.all_transactions (tax_invoice_date,
                                                       tax_category,
                                                       currency_code,
                                                       event_date,
                                                       debit_date,
                                                       event_amount,
                                                       financial_entity,
                                                       vat,
                                                       user_description,
                                                       tax_invoice_number,
                                                       tax_invoice_amount,
                                                       receipt_invoice_number,
                                                       business_trip,
                                                       personal_category,
                                                       financial_accounts_to_balance,
                                                       bank_reference,
                                                       event_number,
                                                       account_number,
                                                       account_type,
                                                       is_conversion,
                                                       currency_rate,
                                                       contra_currency_code,
                                                       bank_description,
                                                       withholding_tax,
                                                       interest,
                                                       proforma_invoice_file,
                                                       original_id,
                                                       id,
                                                       reviewed,
                                                       hashavshevet_id,
                                                       current_balance,
                                                       tax_invoice_file,
                                                       detailed_bank_description)

        VALUES (NEW.tax_invoice_date,
                NEW.tax_category,
                (CASE
                     WHEN NEW.currency_id = 'ש"ח' THEN 'ILS'
                     WHEN NEW.currency_id = 'NIS' THEN 'ILS'
                     ELSE NEW.currency_id END
                    ),
                CASE
                    WHEN NEW.full_purchase_date IS NULL THEN NEW.full_purchase_date_outbound::text::date
                    WHEN NEW.full_purchase_date_outbound IS NULL THEN NEW.full_purchase_date::text::date
                    END,
                NEW.full_payment_date::text::date,
                CASE
                    WHEN NEW.payment_sum IS NULL THEN (NEW.payment_sum_outbound * -1)
                    WHEN NEW.payment_sum_outbound IS NULL THEN (NEW.payment_sum * -1)
                    END,
                NEW.financial_entity,
                NEW.vat,
                NEW.user_description,
                NEW.tax_invoice_number,
                NEW.tax_invoice_amount,
                NEW.receipt_invoice_number,
                NEW.business_trip,
                NEW.personal_category,
                NEW.even_with_dotan,
                NEW.voucher_number,
                NEW.voucher_number,
                NEW.card,
                'creditcard',
                FALSE,
                0,
                null::integer,
                CASE
                    WHEN NEW.full_supplier_name_outbound IS NULL THEN NEW.full_supplier_name_heb
                    WHEN NEW.full_supplier_name_heb IS NULL THEN (COALESCE(NEW.full_supplier_name_outbound, '') ||
                                                                  COALESCE('/' || NEW.city, ''))
                    END,
                NEW.withholding_tax,
                NEW.interest,
                NEW.proforma_invoice_file,
                NEW.id,
                gen_random_uuid(),
                NEW.reviewed,
                NEW.hashavshevet_id,
                0,
                NEW.tax_invoice_file,
                CASE
                    WHEN NEW.full_supplier_name_outbound IS NULL THEN NEW.full_supplier_name_heb
                    WHEN NEW.full_supplier_name_heb IS NULL THEN (COALESCE(NEW.full_supplier_name_outbound, '') ||
                                                                  COALESCE('/' || NEW.city, ''))
                    END);
    END IF;
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';


drop trigger new_isracard_transaction_insert_trigger on accounter_schema.isracard_creditcard_transactions;
CREATE TRIGGER new_isracard_transaction_insert_trigger

    AFTER INSERT

    ON accounter_schema.isracard_creditcard_transactions

    FOR EACH ROW

EXECUTE PROCEDURE insert_creditcard_transaction_into_merged_table();



create or replace function insert_ils_transaction_into_merged_table()
    RETURNS trigger AS
$$
BEGIN

    INSERT INTO accounter_schema.all_transactions (tax_invoice_date,
                                                   tax_category,
                                                   currency_code,
                                                   event_date,
                                                   debit_date,
                                                   event_amount,
                                                   financial_entity,
                                                   vat,
                                                   user_description,
                                                   tax_invoice_number,
                                                   tax_invoice_amount,
                                                   receipt_invoice_number,
                                                   business_trip,
                                                   personal_category,
                                                   financial_accounts_to_balance,
                                                   bank_reference,
                                                   event_number,
                                                   account_number,
                                                   account_type,
                                                   is_conversion,
                                                   currency_rate,
                                                   contra_currency_code,
                                                   bank_description,
                                                   withholding_tax,
                                                   interest,
                                                   proforma_invoice_file,
                                                   original_id,
                                                   id,
                                                   reviewed,
                                                   hashavshevet_id,
                                                   current_balance,
                                                   tax_invoice_file,
                                                   detailed_bank_description)

    VALUES (new.tax_invoice_date,
            new.tax_category,
            'ILS',
            new.event_date::text::date,
            new.event_date::text::date,
            (CASE
                 WHEN new.event_activity_type_code = 2 THEN (new.event_amount * -1)
                 ELSE new.event_amount END
                ),
            new.financial_entity,
            new.vat,
            new.user_description,
            new.tax_invoice_number,
            new.tax_invoice_amount,
            new.receipt_invoice_number,
            new.business_trip,
            new.personal_category,
            new.even_with_dotan,
            new.reference_number,
            new.expanded_event_date,
            new.account_number,
            'checking_ils',
            (new.activity_type_code = 142),
            0,
            null::integer, -- maybe if I'll do a transfer it will also show up?
            new.activity_description,
            new.withholding_tax,
            new.interest,
            new.proforma_invoice_file,
            new.id,
            gen_random_uuid(),
            new.reviewed,
            new.hashavshevet_id,
            new.current_balance,
            new.tax_invoice_file,
            concat(
                    new.activity_description,
                    ' ',
                    coalesce(new.beneficiary_details_data_party_name, ''),
                    ' ',
                    coalesce(new.beneficiary_details_data_message_detail, ''),
                    ' ',
                    coalesce(new.english_action_desc, '')
                ));
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';



CREATE TRIGGER new_ils_transaction_insert_trigger

    AFTER INSERT

    ON accounter_schema.poalim_ils_account_transactions

    FOR EACH ROW

EXECUTE PROCEDURE insert_ils_transaction_into_merged_table();



create or replace function insert_usd_transaction_into_merged_table()
    RETURNS trigger AS
$$
BEGIN

    INSERT INTO accounter_schema.all_transactions (tax_invoice_date,
                                                   tax_category,
                                                   currency_code,
                                                   event_date,
                                                   debit_date,
                                                   event_amount,
                                                   financial_entity,
                                                   vat,
                                                   user_description,
                                                   tax_invoice_number,
                                                   tax_invoice_amount,
                                                   receipt_invoice_number,
                                                   business_trip,
                                                   personal_category,
                                                   financial_accounts_to_balance,
                                                   bank_reference,
                                                   event_number,
                                                   account_number,
                                                   account_type,
                                                   is_conversion,
                                                   currency_rate,
                                                   contra_currency_code,
                                                   bank_description,
                                                   withholding_tax,
                                                   interest,
                                                   proforma_invoice_file,
                                                   original_id,
                                                   id,
                                                   reviewed,
                                                   hashavshevet_id,
                                                   current_balance,
                                                   tax_invoice_file,
                                                   detailed_bank_description)

    VALUES (new.tax_invoice_date,
            new.tax_category,
            'USD',
            new.executing_date::text::date,
            new.value_date::text::date,
            (CASE
                 WHEN new.event_activity_type_code = 2 THEN (new.event_amount * -1)
                 ELSE new.event_amount END
                ),
            new.financial_entity,
            new.vat,
            new.user_description,
            new.tax_invoice_number,
            new.tax_invoice_amount,
            new.receipt_invoice_number,
            new.business_trip,
            new.personal_category,
            new.even_with_dotan,
            new.reference_number,
            new.event_number,
            new.account_number,
            'checking_usd',
            (new.rate_fixing_code <> 0),
            new.currency_rate,
            new.contra_currency_code,
            new.activity_description || COALESCE('/' || new.event_details, ''),
            new.withholding_tax,
            new.interest,
            new.proforma_invoice_file,
            new.id,
            gen_random_uuid(),
            new.reviewed,
            new.hashavshevet_id,
            new.current_balance,
            new.tax_invoice_file,
            concat(
                    new.activity_description,
                    ' ',
                    coalesce(new.event_details, ''),
                    ' ',
                    coalesce(new.account_name, '')
                ));
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';



CREATE TRIGGER new_usd_transaction_insert_trigger

    AFTER INSERT

    ON accounter_schema.poalim_usd_account_transactions

    FOR EACH ROW

EXECUTE PROCEDURE insert_usd_transaction_into_merged_table();



create or replace function insert_eur_transaction_into_merged_table()
    RETURNS trigger AS
$$
BEGIN

    INSERT INTO accounter_schema.all_transactions (tax_invoice_date,
                                                   tax_category,
                                                   currency_code,
                                                   event_date,
                                                   debit_date,
                                                   event_amount,
                                                   financial_entity,
                                                   vat,
                                                   user_description,
                                                   tax_invoice_number,
                                                   tax_invoice_amount,
                                                   receipt_invoice_number,
                                                   business_trip,
                                                   personal_category,
                                                   financial_accounts_to_balance,
                                                   bank_reference,
                                                   event_number,
                                                   account_number,
                                                   account_type,
                                                   is_conversion,
                                                   currency_rate,
                                                   contra_currency_code,
                                                   bank_description,
                                                   withholding_tax,
                                                   interest,
                                                   proforma_invoice_file,
                                                   original_id,
                                                   id,
                                                   reviewed,
                                                   hashavshevet_id,
                                                   current_balance,
                                                   tax_invoice_file,
                                                   detailed_bank_description)

    VALUES (new.tax_invoice_date,
            new.tax_category,
            'EUR',
            new.executing_date::text::date,
            new.value_date::text::date,
            (CASE
                 WHEN new.event_activity_type_code = 2 THEN (new.event_amount * -1)
                 ELSE new.event_amount END
                ),
            new.financial_entity,
            new.vat,
            new.user_description,
            new.tax_invoice_number,
            new.tax_invoice_amount,
            new.receipt_invoice_number,
            new.business_trip,
            new.personal_category,
            new.even_with_dotan,
            new.reference_number,
            new.event_number,
            new.account_number,
            'checking_eur',
            (new.rate_fixing_code <> 0),
            new.currency_rate,
            new.contra_currency_code,
            new.activity_description || COALESCE('/' || new.event_details, ''),
            new.withholding_tax,
            new.interest,
            new.proforma_invoice_file,
            new.id,
            gen_random_uuid(),
            new.reviewed,
            new.hashavshevet_id,
            new.current_balance,
            new.tax_invoice_file,
            concat(
                    new.activity_description,
                    ' ',
                    coalesce(new.event_details, ''),
                    ' ',
                    coalesce(new.account_name, '')
                ));
    RETURN NEW;
END;
$$
    LANGUAGE 'plpgsql';



CREATE TRIGGER new_eur_transaction_insert_trigger

    AFTER INSERT

    ON accounter_schema.poalim_eur_account_transactions

    FOR EACH ROW

EXECUTE PROCEDURE insert_eur_transaction_into_merged_table();