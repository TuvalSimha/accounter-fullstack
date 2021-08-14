



SELECT * FROM get_vat_for_month('2020-12-01');

drop function get_vat_for_month(month_input varchar);
CREATE OR REPLACE FUNCTION get_vat_for_month(month_input varchar)
RETURNS TABLE (
    overall_VAT_status numeric(9,2),
    vat numeric(9,2),
    event_date date,
    event_amount numeric(9,2),
    financial_entity varchar,
    user_description varchar,
    bank_reference bigint,
    account_number integer)
LANGUAGE SQL
AS $$
SELECT
       SUM((CASE WHEN financial_entity = 'VAT' THEN (event_amount*-1)
            ELSE (real_vat) END)::numeric(9,2))
           OVER (ORDER BY event_date, event_amount, bank_reference, account_number)
           as overall_VAT_status,
       real_vat::numeric(9,2), event_date, event_amount, financial_entity, user_description, bank_reference, account_number
FROM formatted_merged_tables
WHERE
        (account_number = 2733 OR account_number = 61066) AND
        (vat IS NOT NULL AND vat <> 0) AND
        event_date::text::date >= date_trunc('month', month_input::date) AND
        event_date::text::date <= (date_trunc('month', month_input::date) + interval '1 month' - interval '1 day')::date
          OR event_date IS NULL
    ORDER BY event_date, event_amount, bank_reference, account_number
$$;