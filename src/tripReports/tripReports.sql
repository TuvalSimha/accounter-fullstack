-- Amsterdam 09/2019
select *
from trip_report(
        '2019-10-15',
        'נסעחול25',
        true,
        ('2019-10-01'::date - '2019-09-21'::date + 1) +
        ('2019-10-15'::date - '2019-10-04'::date + 1),
        0
    );

-- Copenhagen 10/2019
select *
from trip_report(
        '2019-10-03',
        'נסעחול26',
        true,
        ('2019-10-03'::date - '2019-10-02'::date + 1),
        0
    );

-- Amsterdam 11/2019
select *
from trip_report(
        '2019-11-21',
        'נסעחול27',
        true,
        ('2019-11-21'::date - '2019-10-31'::date + 1),
        0
    );

-- '2019-11-22'::date - '2019-12-04'::date, China 11/2019 28
-- '2019-12-05'::date - ''::date, Japan 11/2019 28
select *
from trip_report(
        '2019-12-09',
        'נסעחול28',
        false,
        1,
        ('2019-12-04'::date - '2019-11-22'::date + 1) - 1
    );
select *
from trip_report(
        '2019-12-09',
        'נסעחול28',
        true,
        0,
        ('2019-12-09'::date - '2019-12-05'::date + 1) - 1
    );

Copenhagen 12/2019 - issue
select *
from trip_report(
        '2019-12-14',
        'נסעחול29',
        true,
        ('2019-12-14'::date - '2019-12-10'::date + 1),
        0
    );


-- Amsterdam 12/2019
select *
from trip_report(
        '2020-01-16',
        'נסעחול30',
        true,
        ('2020-01-16'::date - '2019-12-15'::date + 1),
        0
    );

-- Copenhagen 02/2020
select *
from trip_report(
        '2020-02-21',
        'נסעחול32',
        true,
        ('2020-02-21'::date - '2020-02-18'::date + 1),
        0
    );

-- France 03/2020
select *
from trip_report(
        '2020-02-21',
        'נסעחול33',
        true,
        ('2020-03-06'::date - '2020-03-04'::date + 1),
        0
    );

-- '2020-02-07'::date - '2020-02-17'::date, Amsterdam 01/2020 31
-- '2020-02-22'::date - '2020-03-03'::date, Amsterdam 01/2020 31
-- '2020-03-07'::date - 'now'::date, Amsterdam 01/2020 31
--
-- NYC 34


select user_description,
       bank_description,
       business_trip,
       event_date
from formatted_merged_tables
where tax_category = 'נסעחול28'
order by event_date;


CREATE OR REPLACE FUNCTION trip_report(last_date_input varchar,
                                       trip_name varchar,
                                       is_higher_country boolean,
                                       number_of_days_with_sleep_input float,
                                       number_of_days_without_sleep_input float default 0)
    RETURNS TABLE
            (
                תאריך_חשבונית   varchar,
                חשבון_חובה_1    varchar,
                סכום_חובה_1     varchar,
                מטח_סכום_חובה_1 varchar,
                מטבע            varchar,
                חשבון_זכות_1    varchar,
                סכום_זכות_1     varchar,
                מטח_סכום_זכות_1 varchar,
                חשבון_חובה_2    varchar,
                סכום_חובה_2     varchar,
                מטח_סכום_חובה_2 varchar,
                חשבון_זכות_2    varchar,
                סכום_זכות_2     varchar,
                מטח_סכום_זכות_2 varchar,
                פרטים           varchar,
                אסמכתא_1        int,
                אסמכתא_2        varchar,
                סוג_תנועה       varchar,
                תאריך_ערך       varchar,
                תאריך_3         varchar
            )
    LANGUAGE SQL
AS
$$

with last_day as (
    select last_date_input::date as date
),
     all_exchange_dates as (
         select dt AS     exchange_date,
                (select t1.eur
                 from accounter_schema.exchange_rates t1
                 where date_trunc('day', t1.exchange_date)::date <= times_table.dt
                 order by t1.exchange_date desc
                 limit 1) eur_rate,
                (select t1.usd
                 from accounter_schema.exchange_rates t1
                 where date_trunc('day', t1.exchange_date)::date <= times_table.dt
                 order by t1.exchange_date desc
                 limit 1) usd_rate
         from times_table
         order by dt
     ),
     all_trip_transactions as (
         select *
         from formatted_merged_tables
         where tax_category = trip_name
         order by event_date
     ),
     formatted_trip_transactions as (
         select formatted_event_date                                            as תאריך_חשבונית,
                tax_category                                                    as חשבון_חובה_1,
                formatted_event_amount_in_ils                                   as סכום_חובה_1,
                formatted_foreign_amount_if_exist                               as מטח_סכום_חובה_1,
                formatted_currency                                              AS מטבע,
                formatted_account                                               as חשבון_זכות_1,
                formatted_event_amount_in_ils                                   as סכום_זכות_1,
                formatted_foreign_amount_if_exist                               as מטח_סכום_זכות_1,
                null                                                            as חשבון_חובה_2,
                null                                                            as סכום_חובה_2,
                null                                                            as מטח_סכום_חובה_2,
                null                                                            as חשבון_זכות_2,
                null                                                            as סכום_זכות_2,
                null                                                            as מטח_סכום_זכות_2,
                user_description                                                AS פרטים,
                bank_reference                                                  AS אסמכתא_1,
                LEFT(regexp_replace(tax_invoice_number, '[^0-9]+', '', 'g'), 9) AS אסמכתא_2,
                null                                                            as סוג_תנועה,
                (CASE
                     WHEN debit_date IS NULL THEN formatted_event_date
                     ELSE formatted_debit_date
                    END)                                                        AS תאריך_ערך,
                formatted_event_date                                            AS תאריך_3
         from all_trip_transactions
     ),
     total_money_for_days as (
         select (number_of_days_with_sleep_input * 80) +
                (number_of_days_without_sleep_input * 133) as total_usd
     ),
     higher_countries as (
         select (case
                     when is_higher_country = true then (total_money_for_days.total_usd / 100) * 125
                     when is_higher_country = false then total_money_for_days.total_usd
             end) as total
         from total_money_for_days
     ),
     exchange_rate as (
         select t1.usd_rate as daily_date
         from all_exchange_dates t1,
              last_day
         where t1.exchange_date::date = last_day.date
     ),
     top_value_date as (
         select max(debit_date) as debit_date
         from formatted_merged_tables
         where tax_category = trip_name
     ),
     total_eshel as (
         select to_char(last_day.date, 'DD/MM/YYYY')                                                 as תאריך_חשבונית,
                trip_name                                                                            as חשבון_חובה_1,
                to_char(float8(higher_countries.total * exchange_rate.daily_date), 'FM999999999.00') as סכום_חובה_1,
                to_char(float8(higher_countries.total), 'FM999999999.00')                            as מטח_סכום_חובה_1,
                '$'                                                                                  as מטבע,
                'אוריח'                                                                              as חשבון_זכות_1,
                to_char(float8(higher_countries.total * exchange_rate.daily_date), 'FM999999999.00') as סכום_זכות_1,
                to_char(float8(higher_countries.total), 'FM999999999.00')                            as מטח_סכום_זכות_1,
                null                                                                                 as חשבון_חובה_2,
                null                                                                                 as סכום_חובה_2,
                null                                                                                 as מטח_סכום_חובה_2,
                null                                                                                 as חשבון_זכות_2,
                null                                                                                 as סכום_זכות_2,
                null                                                                                 as מטח_סכום_זכות_2,
                'אש״ל לא מנוצלות'                                                                    as פרטים,
                null::int                                                                            as אסמכתא_1,
                null                                                                                 as אסמכתא_2,
                null                                                                                 as סוג_תנועה,
                to_char(top_value_date.debit_date, 'DD/MM/YYYY')                                     as תאריך_ערך,
                null                                                                                 AS תאריך_3
         from last_day,
              exchange_rate,
              higher_countries,
              top_value_date)
select *
from formatted_trip_transactions
union all
select *
from total_eshel;

$$;