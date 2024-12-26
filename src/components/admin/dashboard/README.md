# Admin Dashboard Components

This directory contains components for the admin dashboard, providing analytics, metrics, and monitoring capabilities.

## Components

### DashboardMetrics

Displays key metrics including:
- Total visitors
- Quote statistics
- User engagement metrics
- Content metrics

Props: None

Usage:
```tsx
import { DashboardMetrics } from './DashboardMetrics';

function AdminDashboard() {
  return <DashboardMetrics />;
}
```

### EngagementCharts

Visualizes user engagement data through interactive charts.

Features:
- User growth trends
- Category engagement metrics
- Time range filtering
- Responsive design

Props: None

Usage:
```tsx
import { EngagementCharts } from './EngagementCharts';

function AdminDashboard() {
  return <EngagementCharts />;
}
```

## Performance Monitoring

The dashboard includes built-in performance monitoring:
- Component render times
- Page load metrics
- Interactive timing measurements

Use the `measureComponentPerformance` utility to track component performance:

```tsx
import { measureComponentPerformance } from '@/utils/performance';

useEffect(() => {
  const stopMeasuring = measureComponentPerformance('DashboardMetrics');
  return stopMeasuring;
}, []);
```

## Testing

Run tests using:
```bash
npm test
```

Test files are located in the `__tests__` directory and cover:
- Component rendering
- Data loading states
- Error handling
- User interactions