# Иконки интернет-банка СберБизнес

Наборы React компонентов SVG иконок и иллюстраций, разработанных и используемых в приложении СберБизнес.

# Пакеты

| Пакет | Папка | Сборка |
|---|---|---|
| [`@sberbusiness/icons`](https://www.npmjs.com/package/@sberbusiness/icons) | [`packages/icons`](packages/icons) | `tools-legacy` |
| [`@sberbusiness/illustrations`](https://www.npmjs.com/package/@sberbusiness/illustrations) | [`packages/illustrations`](packages/illustrations) | `tools-legacy` |
| [`@sberbusiness/icons-next`](https://www.npmjs.com/package/@sberbusiness/icons-next) | [`packages/icons-next`](packages/icons-next) | `tools` |

Установка и использование описаны в README каждого пакета.

# Сборка

```sh
npm ci
npm run build:icons      # или build:illustrations, build:icons-next
```

Собранный пакет появляется в папке `public`. Пакеты собираются и выпускаются в GitHub Actions workflow Build и Publish, пакет выбирается при запуске.
