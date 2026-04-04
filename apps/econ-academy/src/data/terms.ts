import { Term } from '../types';
import { termsFundamentals } from './terms-fundamentals';
import { termsMarketPrice } from './terms-market-price';
import { termsConsumerProducer } from './terms-consumer-producer';
import { termsMarketFailure } from './terms-market-failure';
import { termsNationalEconomy } from './terms-national-economy';
import { termsGrowthProductivity } from './terms-growth-productivity';
import { termsMoneyFinance } from './terms-money-finance';
import { termsMacroFluctuation } from './terms-macro-fluctuation';
import { termsMacroPolicy } from './terms-macro-policy';
import { termsInternational } from './terms-international';

export const allTerms: Term[] = [
  ...termsFundamentals,
  ...termsMarketPrice,
  ...termsConsumerProducer,
  ...termsMarketFailure,
  ...termsNationalEconomy,
  ...termsGrowthProductivity,
  ...termsMoneyFinance,
  ...termsMacroFluctuation,
  ...termsMacroPolicy,
  ...termsInternational,
];
