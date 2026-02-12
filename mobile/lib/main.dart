import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/pages/splash/splash_page.dart';
import 'presentation/pages/auth/login_page.dart';
import 'presentation/pages/auth/register_page.dart';
import 'presentation/pages/dashboard/dashboard_page.dart';
import 'presentation/pages/plots/manage_plots_page.dart';
import 'presentation/pages/plots/plot_details_page.dart';
import 'presentation/pages/reports/view_reports_page.dart';
import 'presentation/pages/reports/detailed_reports_page.dart';
import 'presentation/pages/harvest/add_harvest_page.dart';
import 'presentation/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Farming Cooperative',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      routerConfig: GoRouter(
        initialLocation: '/splash',
        errorBuilder: (context, state) => MaterialApp(
          home: Scaffold(
            appBar: AppBar(title: Text('Route Not Found')),
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error, size: 64, color: Colors.red),
                  SizedBox(height: 16),
                  Text(
                    'Route not found: ${state.uri.toString()}',
                    style: TextStyle(fontSize: 18),
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.go('/dashboard'),
                    child: Text('Go to Dashboard'),
                  ),
                ],
              ),
            ),
          ),
        ),
        routes: [
          GoRoute(
            path: '/splash',
            builder: (context, state) => const SplashPage(),
          ),
          GoRoute(
            path: '/login',
            builder: (context, state) => const LoginPage(),
          ),
          GoRoute(
            path: '/register',
            builder: (context, state) => const RegisterPage(),
          ),
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardPage(),
          ),
          GoRoute(
            path: '/add-harvest',
            builder: (context, state) => const AddHarvestPage(),
          ),
          GoRoute(
            path: '/manage-plots',
            builder: (context, state) => const ManagePlotsPage(),
          ),
          GoRoute(
            path: '/plot-details',
            builder: (context, state) => const PlotDetailsPage(plot: {}),
          ),
          GoRoute(
            path: '/view-reports',
            builder: (context, state) => const ViewReportsPage(),
          ),
          GoRoute(
            path: '/detailed-reports',
            builder: (context, state) => const DetailedReportsPage(),
          ),
        ],
      ),
    );
  }
}
