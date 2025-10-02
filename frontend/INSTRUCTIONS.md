# Инструкции по использованию компонентов

## Компонент Shimmer

Компонент `Shimmer` предназначен для создания эффекта мерцания при загрузке контента. Он не задает никаких размеров или форм, а только добавляет анимацию.

### Основное использование

```tsx
import { Shimmer } from '@/components/styles/ui';

// Аватар с анимацией мерцания
<Shimmer style={{
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#f0f0f0'
}}>
  <div />
</Shimmer>

// Текст с анимацией
<Shimmer style={{
  height: '16px',
  borderRadius: '4px',
  backgroundColor: '#e0e0e0',
  width: '200px'
}}>
  <div />
</Shimmer>

// Через CSS классы
<Shimmer className="my-loading-avatar">
  <div />
</Shimmer>
```

### Props

- `show_animation?: boolean` - включить/выключить анимацию (по умолчанию `true`)
- `className?: string` - дополнительные CSS классы
- `children?: ReactNode` - содержимое компонента
- `...props` - все остальные HTML атрибуты для div

### Особенности

1. **Наследование стилей**: Компонент наследует `border-radius` от родительских стилей через `border-radius: inherit`
2. **Гибкость**: Все размеры, цвета и формы задаются через `style` или `className`
3. **Анимация**: Градиентная волна проходит слева направо с плавным появлением/исчезновением

### Примеры стилей

```scss
// В вашем CSS файле
.loading-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
}

.loading-text {
  height: 14px;
  border-radius: 2px;
  background-color: #e8e8e8;
  width: 100%;
}

.loading-card {
  padding: 16px;
  border-radius: 8px;
  background-color: #fafafa;
  min-height: 120px;
}
```
