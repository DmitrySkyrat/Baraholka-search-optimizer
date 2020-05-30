export interface Currency {
  buy: number;
  sell: number;
}

export interface CurrencyMap {
  USD?: Currency;
}

class CurrencyService {
  async fetchCurrencies(): Promise<CurrencyMap> {
    const currList = await fetch('https://cors-anywhere.herokuapp.com/https://belarusbank.by/api/kursExchange', {
      cache: "no-cache"
    }).then(r => r.json());

    return {
      USD: {
        sell: currList[0].USD_in,
        buy: currList[0].USD_out
      }
    };

  }
}

export const currencyService = new CurrencyService();



