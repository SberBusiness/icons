# Иконки интернет-банка СберБизнес

Это набор React компонентов SVG иконок, разработанных и используемых в приложении СберБизнес.

# Установка

Пакет `@sberbusiness/icons-next` опубликован в [npm](https://www.npmjs.com/package/@sberbusiness/icons-next).

```sh
npm install @sberbusiness/icons-next
```

После установки пакета нужно подключить стили из `@sberbusiness/icons-next/styles/icons.css`.

# Использование

Цвета иконок зависят от темы, поэтому приложение нужно обернуть в `ThemeProvider`. По умолчанию класс темы добавляется к `document.documentElement`, другой элемент можно передать через `scopeRef`.

Одноцветным иконкам передаётся `paletteIndex` — индекс цветовой палитры от 0 до 11. Многоцветные иконки используются без него.

```tsx
import {ThemeProvider, EIconsTheme, CirclesmallStrokeSrvIcon20} from '@sberbusiness/icons-next';
import '@sberbusiness/icons-next/styles/icons.css';

const App = () => (
    <ThemeProvider theme={EIconsTheme.LIGHT}>
        <CirclesmallStrokeSrvIcon20 paletteIndex={0} />
    </ThemeProvider>
);
```

Текущую тему можно получить хуком `useTheme`.
