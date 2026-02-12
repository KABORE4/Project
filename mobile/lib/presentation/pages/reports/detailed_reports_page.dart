import 'package:flutter/material.dart';

class DetailedReportsPage extends StatefulWidget {
  const DetailedReportsPage({super.key});

  @override
  State<DetailedReportsPage> createState() => _DetailedReportsPageState();
}

class _DetailedReportsPageState extends State<DetailedReportsPage> {
  String _selectedPeriod = 'This Month';
  String _selectedReportType = 'All';
  String _selectedPlot = 'All Plots';

  final List<Map<String, dynamic>> _reports = [
    {
      'id': 'RPT001',
      'title': 'Monthly Harvest Report',
      'type': 'Harvest',
      'period': 'March 2024',
      'plot': 'Plot A',
      'date': '2024-04-01',
      'status': 'Completed',
      'summary': 'Total harvest: 42 tons of corn from Plot A',
      'details': [
        'Corn variety: Hybrid Sweet Corn',
        'Total weight: 42,000 kg',
        'Quality grade: A',
        'Moisture content: 14.5%',
        'Harvest duration: 3 days',
        'Labor cost: \$1,200',
        'Equipment cost: \$800',
        'Storage cost: \$300',
        'Total revenue: \$12,600',
        'Profit margin: 68%'
      ],
      'charts': ['Yield Comparison', 'Quality Distribution', 'Cost Breakdown'],
    },
    {
      'id': 'RPT002',
      'title': 'Soil Analysis Report',
      'type': 'Soil',
      'period': 'Q1 2024',
      'plot': 'All Plots',
      'date': '2024-03-15',
      'status': 'Completed',
      'summary': 'Comprehensive soil testing for all farm plots',
      'details': [
        'Plot A: pH 6.5, Organic matter 3.2%',
        'Plot B: pH 6.8, Organic matter 2.8%',
        'Plot C: pH 6.2, Organic matter 3.5%',
        'Nitrogen levels: Medium across all plots',
        'Phosphorus levels: Adequate in Plot A, Low in B & C',
        'Potassium levels: Good in all plots',
        'Recommendations: Add P fertilizer to Plots B & C',
        'Next testing: June 2024'
      ],
      'charts': ['pH Levels', 'Nutrient Analysis', 'Organic Matter'],
    },
    {
      'id': 'RPT003',
      'title': 'Equipment Usage Report',
      'type': 'Equipment',
      'period': 'March 2024',
      'plot': 'All Plots',
      'date': '2024-04-01',
      'status': 'Completed',
      'summary': 'Monthly equipment utilization and maintenance',
      'details': [
        'Tractor: 120 hours usage, 95% availability',
        'Combine harvester: 45 hours usage, 100% availability',
        'Irrigation system: 180 hours usage, 98% availability',
        'Plow: 30 hours usage, 100% availability',
        'Maintenance completed: Tractor oil change',
        'Fuel consumption: 450 liters total',
        'Operating cost: \$2,340',
        'Rental income: \$1,200'
      ],
      'charts': ['Usage Hours', 'Availability Rate', 'Cost Analysis'],
    },
    {
      'id': 'RPT004',
      'title': 'Financial Summary Report',
      'type': 'Financial',
      'period': 'Q1 2024',
      'plot': 'All Plots',
      'date': '2024-04-05',
      'status': 'In Progress',
      'summary': 'Quarterly financial performance analysis',
      'details': [
        'Total revenue: \$45,600',
        'Total expenses: \$18,400',
        'Net profit: \$27,200',
        'Profit margin: 59.6%',
        'Harvest revenue: \$38,400',
        'Equipment rental: \$4,200',
        'Other income: \$3,000',
        'Labor costs: \$8,200',
        'Equipment costs: \$5,100',
        'Input costs: \$3,800',
        'Other expenses: \$1,300'
      ],
      'charts': ['Revenue Breakdown', 'Expense Analysis', 'Profit Trends'],
    },
    {
      'id': 'RPT005',
      'title': 'Weather Impact Report',
      'type': 'Weather',
      'period': 'March 2024',
      'plot': 'All Plots',
      'date': '2024-04-01',
      'status': 'Completed',
      'summary': 'Weather conditions and their impact on farming operations',
      'details': [
        'Average temperature: 18.5°C',
        'Total rainfall: 85mm',
        'Sunny days: 22',
        'Rainy days: 6',
        'Cloudy days: 3',
        'Impact on planting: Optimal conditions',
        'Impact on growth: Above average',
        'Irrigation needed: 12 days',
        'Weather-related delays: 0 days'
      ],
      'charts': ['Temperature Trends', 'Rainfall Distribution', 'Growth Impact'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detailed Reports'),
        backgroundColor: const Color(0xFF9C27B0),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
            tooltip: 'Filter Reports',
          ),
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: _downloadReport,
            tooltip: 'Download Report',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Filter Section
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.purple[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.purple[200]!),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Filters',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF9C27B0),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _selectedPeriod,
                          decoration: const InputDecoration(
                            labelText: 'Period',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                          items: ['This Month', 'Last Month', 'This Quarter', 'Last Quarter', 'This Year'].map((period) {
                            return DropdownMenuItem(value: period, child: Text(period));
                          }).toList(),
                          onChanged: (value) {
                            setState(() {
                              _selectedPeriod = value!;
                            });
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: _selectedReportType,
                          decoration: const InputDecoration(
                            labelText: 'Report Type',
                            border: OutlineInputBorder(),
                            isDense: true,
                          ),
                          items: ['All', 'Harvest', 'Soil', 'Equipment', 'Financial', 'Weather'].map((type) {
                            return DropdownMenuItem(value: type, child: Text(type));
                          }).toList(),
                          onChanged: (value) {
                            setState(() {
                              _selectedReportType = value!;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _selectedPlot,
                    decoration: const InputDecoration(
                      labelText: 'Plot',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    items: ['All Plots', 'Plot A', 'Plot B', 'Plot C', 'Plot D'].map((plot) {
                      return DropdownMenuItem(value: plot, child: Text(plot));
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedPlot = value!;
                      });
                    },
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Statistics Cards
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Total Reports',
                    _reports.length.toString(),
                    Icons.assessment,
                    Colors.purple,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Completed',
                    _reports.where((r) => r['status'] == 'Completed').length.toString(),
                    Icons.check_circle,
                    Colors.green,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'In Progress',
                    _reports.where((r) => r['status'] == 'In Progress').length.toString(),
                    Icons.pending,
                    Colors.orange,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'This Month',
                    _reports.where((r) => r['period'] == 'March 2024').length.toString(),
                    Icons.calendar_today,
                    Colors.blue,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 20),
            
            // Reports List
            const Text(
              'Available Reports',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            ..._reports.map((report) => _buildReportCard(report)).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: color.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportCard(Map<String, dynamic> report) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () => _showReportDetails(report),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getReportTypeColor(report['type']),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      report['type'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(report['status']),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      report['status'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                report['title'],
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                report['summary'],
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    report['date'],
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    report['plot'],
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                  const Spacer(),
                  Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey[400]),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showReportDetails(Map<String, dynamic> report) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        maxChildSize: 0.95,
        minChildSize: 0.5,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getReportTypeColor(report['type']),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      report['type'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                report['title'],
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Report ID: ${report['id']}',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 20),
              
              // Charts Section
              const Text(
                'Available Charts',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: (report['charts'] as List<String>).map((chart) {
                  return Chip(
                    label: Text(chart),
                    backgroundColor: Colors.purple[100],
                    labelStyle: const TextStyle(color: Color(0xFF9C27B0)),
                  );
                }).toList(),
              ),
              
              const SizedBox(height: 20),
              
              // Details Section
              const Text(
                'Report Details',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: (report['details'] as List<String>).length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            margin: const EdgeInsets.only(top: 6, right: 8),
                            decoration: BoxDecoration(
                              color: Colors.purple,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                          Expanded(
                            child: Text(
                              report['details'][index],
                              style: const TextStyle(fontSize: 14),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              
              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Download started!'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      },
                      icon: const Icon(Icons.download),
                      label: const Text('Download'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF9C27B0),
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Share link copied!'),
                            backgroundColor: Colors.blue,
                          ),
                        );
                      },
                      icon: const Icon(Icons.share),
                      label: const Text('Share'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Advanced Filters'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Filter options coming soon!'),
            const SizedBox(height: 16),
            const Text('Available filters:'),
            const SizedBox(height: 8),
            const Text('• Date range'),
            const Text('• Report status'),
            const Text('• Plot selection'),
            const Text('• Report categories'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _downloadReport() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Select a report to download'),
        backgroundColor: Colors.purple,
      ),
    );
  }

  Color _getReportTypeColor(String type) {
    switch (type) {
      case 'Harvest':
        return Colors.green;
      case 'Soil':
        return Colors.brown;
      case 'Equipment':
        return Colors.blue;
      case 'Financial':
        return Colors.orange;
      case 'Weather':
        return Colors.cyan;
      default:
        return Colors.grey;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Completed':
        return Colors.green;
      case 'In Progress':
        return Colors.orange;
      case 'Pending':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
