import 'package:flutter/material.dart';

class ViewReportsPage extends StatefulWidget {
  const ViewReportsPage({super.key});

  @override
  State<ViewReportsPage> createState() => _ViewReportsPageState();
}

class _ViewReportsPageState extends State<ViewReportsPage> {
  String _selectedPeriod = 'This Month';
  String _selectedReportType = 'All';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('View Reports'),
        backgroundColor: const Color(0xFF9C27B0),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Download feature coming soon!'),
                  backgroundColor: Colors.purple,
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF9C27B0), Color(0xFFBA68C8)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.analytics, color: Colors.white, size: 40),
                  SizedBox(height: 8),
                  Text(
                    'Farm Reports',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Analyze your farming performance',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 24),
            
            // Period and Type Filters
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedPeriod,
                    decoration: const InputDecoration(
                      labelText: 'Period',
                      prefixIcon: Icon(Icons.date_range),
                      border: OutlineInputBorder(),
                    ),
                    items: ['This Week', 'This Month', 'This Quarter', 'This Year', 'All Time'].map((period) {
                      return DropdownMenuItem(value: period, child: Text(period));
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedPeriod = value!;
                      });
                    },
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _selectedReportType,
                    decoration: const InputDecoration(
                      labelText: 'Report Type',
                      prefixIcon: Icon(Icons.category),
                      border: OutlineInputBorder(),
                    ),
                    items: ['All', 'Harvest', 'Equipment', 'Financial', 'Weather'].map((type) {
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
            
            SizedBox(height: 24),
            
            // Summary Cards
            const Text(
              'Summary Overview',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    'Total Revenue',
                    '\$12,450',
                    Icons.attach_money,
                    Colors.green,
                    '+15.3%',
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryCard(
                    'Total Harvest',
                    '3,250 kg',
                    Icons.agriculture,
                    Colors.orange,
                    '+8.7%',
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    'Equipment Usage',
                    '142 hours',
                    Icons.agriculture_outlined,
                    Colors.blue,
                    '+12.1%',
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryCard(
                    'Active Plots',
                    '4 / 5',
                    Icons.landscape,
                    Colors.purple,
                    '80%',
                  ),
                ),
              ],
            ),
            
            SizedBox(height: 24),
            
            // Charts Section
            const Text(
              'Performance Charts',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            
            // Harvest Yield Chart
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.show_chart, color: Colors.purple),
                        const SizedBox(width: 8),
                        const Text(
                          'Harvest Yield Trend',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Last 6 months',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    Container(
                      height: 200,
                      child: _buildHarvestChart(),
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 16),
            
            // Revenue Distribution Chart
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.pie_chart, color: Colors.purple),
                        const SizedBox(width: 8),
                        const Text(
                          'Revenue Distribution',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'This month',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    Container(
                      height: 200,
                      child: _buildRevenueChart(),
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 24),
            
            // Detailed Reports List
            const Text(
              'Detailed Reports',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            
            _buildReportItem(
              'Monthly Harvest Report',
              'March 2024',
              'PDF • 2.3 MB',
              Icons.description,
              Colors.green,
            ),
            _buildReportItem(
              'Equipment Usage Summary',
              'Q1 2024',
              'PDF • 1.8 MB',
              Icons.description,
              Colors.blue,
            ),
            _buildReportItem(
              'Financial Statement',
              'March 2024',
              'PDF • 3.1 MB',
              Icons.description,
              Colors.orange,
            ),
            _buildReportItem(
              'Weather Impact Analysis',
              'March 2024',
              'PDF • 1.2 MB',
              Icons.description,
              Colors.purple,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String title, String value, IconData icon, Color color, String change) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 20),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: change.startsWith('+') ? Colors.green[100] : Colors.red[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    change,
                    style: TextStyle(
                      color: change.startsWith('+') ? Colors.green[700] : Colors.red[700],
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHarvestChart() {
    final data = [450, 520, 480, 590, 610, 550];
    final months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    
    return CustomPaint(
      painter: HarvestChartPainter(data, months),
      child: Container(),
    );
  }

  Widget _buildRevenueChart() {
    return Column(
      children: [
        _buildRevenueSegment('Corn', 45, Colors.orange),
        _buildRevenueSegment('Wheat', 30, Colors.amber),
        _buildRevenueSegment('Vegetables', 15, Colors.green),
        _buildRevenueSegment('Other', 10, Colors.grey),
      ],
    );
  }

  Widget _buildRevenueSegment(String label, int percentage, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
              Text('$percentage%', style: const TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          LinearProgressIndicator(
            value: percentage / 100,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ],
      ),
    );
  }

  Widget _buildReportItem(String title, String subtitle, String details, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: color.withOpacity(0.1),
            child: Icon(icon, color: color),
          ),
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          subtitle: Text(subtitle),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                details,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 4),
              Icon(Icons.download, color: Colors.purple, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class HarvestChartPainter extends CustomPainter {
  final List<int> data;
  final List<String> months;

  HarvestChartPainter(this.data, this.months);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.purple
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final fillPaint = Paint()
      ..color = Colors.purple.withOpacity(0.1)
      ..style = PaintingStyle.fill;

    final maxValue = data.reduce((a, b) => a > b ? a : b).toDouble();
    final width = size.width / (data.length - 1);
    final height = size.height;

    // Draw filled area
    final fillPath = Path();
    fillPath.moveTo(0, height);
    
    for (int i = 0; i < data.length; i++) {
      final x = i * width;
      final y = height - (data[i] / maxValue * height * 0.8);
      
      if (i == 0) {
        fillPath.moveTo(x, y);
      } else {
        fillPath.lineTo(x, y);
      }
    }
    
    fillPath.lineTo(width * (data.length - 1), height);
    fillPath.close();
    canvas.drawPath(fillPath, fillPaint);

    // Draw line
    final path = Path();
    for (int i = 0; i < data.length; i++) {
      final x = i * width;
      final y = height - (data[i] / maxValue * height * 0.8);
      
      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }

      // Draw points
      canvas.drawCircle(Offset(x, y), 4, paint);
    }
    canvas.drawPath(path, paint);

    // Draw labels
    final textPainter = TextPainter(
      textDirection: TextDirection.ltr,
    );

    for (int i = 0; i < months.length; i++) {
      final x = i * width;
      textPainter.text = TextSpan(
        text: months[i],
        style: const TextStyle(fontSize: 10, color: Colors.grey),
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(x - textPainter.width / 2, height + 5));
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
