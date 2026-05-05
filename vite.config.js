// vite.config.js
import imagemin from "unplugin-imagemin/vite";
import { defineConfig } from "vite";

const repositoryName = "four-horses-landing";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? `/${repositoryName}/` : "/",
  plugins: [
    imagemin({
      // Включаем плагин только для production-сборки
      disable: false,
      mode: "sharp", // Используем высокопроизводительный Sharp
      compress: {
        // Настройки сжатия для разных форматов
        jpg: {
          quality: 75,
          progressive: true, // Прогрессивный JPEG для "плавной" загрузки
        },
        jpeg: {
          quality: 75,
          progressive: true,
        },
        png: {
          quality: 75,
          compressionLevel: 9, // Максимальный уровень сжатия
        },
        webp: {
          quality: 75, // Отличный баланс качества и размера
        },
        avif: {
          quality: 60, // AVIF даёт лучшее сжатие, можно чуть сильнее сжать
        },
        svg: {
          multipass: true, // Многопроходная оптимизация SVG
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  // Отключаем удаление viewBox, чтобы не сломать верстку
                  removeViewBox: false,
                },
              },
            },
            "removeDimensions", // Убираем лишние атрибуты width/height
            "sortAttrs", // Сортируем атрибуты для лучшего сжатия
          ],
        },
      },
    }),
  ],
});
