import 'package:flutter/material.dart';

class ManagePlotsPage extends StatefulWidget {
  const ManagePlotsPage({super.key});

  @override
  State<ManagePlotsPage> createState() => _ManagePlotsPageState();
}

class _ManagePlotsPageState extends State<ManagePlotsPage> {
  final _plotNameController = TextEditingController();
  final _sizeController = TextEditingController();
  final _locationController = TextEditingController();
  final _cropController = TextEditingController();
  String _selectedStatus = 'Active';
  String _selectedSoilType = 'Loamy';

  @override
  void dispose() {
    _plotNameController.dispose();
    _sizeController.dispose();
    _locationController.dispose();
    _cropController.dispose();
    super.dispose();
  }

  void _showAddPlotDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add New Plot'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _plotNameController,
                decoration: const InputDecoration(
                  labelText: 'Plot Name',
                  hintText: 'e.g., Plot A, North Field',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _sizeController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Size (hectares)',
                  hintText: 'Enter plot size',
                  suffixText: 'ha',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location',
                  hintText: 'e.g., North of barn',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedSoilType,
                decoration: const InputDecoration(
                  labelText: 'Soil Type',
                  border: OutlineInputBorder(),
                ),
                items: ['Loamy', 'Clay', 'Sandy', 'Silty', 'Peaty'].map((soil) {
                  return DropdownMenuItem(value: soil, child: Text(soil));
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedSoilType = value!;
                  });
                },
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _cropController,
                decoration: const InputDecoration(
                  labelText: 'Current Crop',
                  hintText: 'e.g., Corn, Wheat, Fallow',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedStatus,
                decoration: const InputDecoration(
                  labelText: 'Status',
                  border: OutlineInputBorder(),
                ),
                items: ['Active', 'Fallow', 'Under Preparation'].map((status) {
                  return DropdownMenuItem(value: status, child: Text(status));
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedStatus = value!;
                  });
                },
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Plot added successfully!'),
                  backgroundColor: Colors.green,
                ),
              );
              // Clear controllers
              _plotNameController.clear();
              _sizeController.clear();
              _locationController.clear();
              _cropController.clear();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2196F3),
              foregroundColor: Colors.white,
            ),
            child: const Text('Add Plot'),
          ),
        ],
      ),
    );
  }

  void _showPlotDetails(Map<String, dynamic> plot) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(plot['name'].toString()),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDetailRow('Size', '${plot['size']} ha'),
              _buildDetailRow('Location', plot['location'].toString()),
              _buildDetailRow('Soil Type', plot['soilType'].toString()),
              _buildDetailRow('Current Crop', plot['crop'].toString()),
              _buildDetailRow('Status', plot['status'].toString()),
              _buildDetailRow('Last Planted', plot['lastPlanted'].toString()),
              _buildDetailRow('Expected Harvest', plot['expectedHarvest'].toString()),
              const SizedBox(height: 16),
              const Text(
                'Notes:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(plot['notes'].toString()),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Edit feature coming soon!'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
            child: const Text('Edit'),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final plots = [
      {
        'name': 'Plot A - North Field',
        'size': 5.2,
        'location': 'North of barn',
        'soilType': 'Loamy',
        'crop': 'Corn',
        'status': 'Active',
        'lastPlanted': '15 Mar 2024',
        'expectedHarvest': '15 Jun 2024',
        'notes': 'Well-drained soil, good sun exposure. Irrigation system installed.',
        'health': 'Good',
        'progress': 0.65,
      },
      {
        'name': 'Plot B - East Field',
        'size': 3.8,
        'location': 'East side, near road',
        'soilType': 'Clay',
        'crop': 'Wheat',
        'status': 'Active',
        'lastPlanted': '1 Feb 2024',
        'expectedHarvest': '1 May 2024',
        'notes': 'Heavy soil, needs proper drainage. Fertilizer applied last week.',
        'health': 'Fair',
        'progress': 0.45,
      },
      {
        'name': 'Plot C - South Field',
        'size': 7.1,
        'location': 'South of property',
        'soilType': 'Sandy',
        'crop': 'Fallow',
        'status': 'Fallow',
        'lastPlanted': '1 Nov 2023',
        'expectedHarvest': 'N/A',
        'notes': 'Preparing for next planting season. Soil testing scheduled.',
        'health': 'N/A',
        'progress': 0.0,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Plots'),
        backgroundColor: const Color(0xFF2196F3),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddPlotDialog,
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
                  colors: [Color(0xFF2196F3), Color(0xFF64B5F6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.landscape, color: Colors.white, size: 40),
                  const SizedBox(height: 8),
                  const Text(
                    'Your Farm Plots',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Total: ${plots.length} plots • ${plots.fold<double>(0.0, (sum, plot) => sum + (plot['size'] as double)).toStringAsFixed(1)} hectares',
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Statistics Cards
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Active Plots',
                    plots.where((p) => p['status'] == 'Active').length.toString(),
                    Icons.check_circle,
                    Colors.green,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Total Area',
                    '${plots.fold<double>(0.0, (sum, plot) => sum + (plot['size'] as double)).toStringAsFixed(1)} ha',
                    Icons.square_foot,
                    Colors.blue,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'Crops Growing',
                    plots.where((p) => p['crop'] != 'Fallow').length.toString(),
                    Icons.grass,
                    Colors.orange,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'Fallow Land',
                    plots.where((p) => p['status'] == 'Fallow').length.toString(),
                    Icons.agriculture,
                    Colors.grey,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Plots List
            const Text(
              'Individual Plots',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            ...plots.map((plot) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: InkWell(
                    onTap: () => _showPlotDetails(plot),
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      plot['name'].toString(),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${plot['size']} ha • ${plot['location']}',
                                      style: TextStyle(
                                        color: Colors.grey[600],
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: plot['status'] == 'Active' ? Colors.green[100] : 
                                         plot['status'] == 'Fallow' ? Colors.grey[100] : Colors.orange[100],
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  plot['status'].toString(),
                                  style: TextStyle(
                                    color: plot['status'] == 'Active' ? Colors.green[700] : 
                                           plot['status'] == 'Fallow' ? Colors.grey[700] : Colors.orange[700],
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          
                          // Crop and Progress
                          if (plot['crop'] != 'Fallow') ...[
                            Row(
                              children: [
                                Icon(Icons.grass, color: Colors.green[600], size: 20),
                                const SizedBox(width: 8),
                                Text(
                                  'Current: ${plot['crop']}',
                                  style: const TextStyle(fontWeight: FontWeight.w500),
                                ),
                                const Spacer(),
                                Text(
                                  '${((plot['progress'] as num) * 100).toInt()}% grown',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            LinearProgressIndicator(
                              value: (plot['progress'] as num).toDouble(),
                              backgroundColor: Colors.grey[300],
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                            ),
                          ],
                          
                          const SizedBox(height: 12),
                          
                          // Quick Actions
                          Row(
                            children: [
                              _buildQuickAction('View Details', Icons.info, Colors.blue),
                              const SizedBox(width: 8),
                              _buildQuickAction('Edit', Icons.edit, Colors.orange),
                              const SizedBox(width: 8),
                              _buildQuickAction('History', Icons.history, Colors.purple),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 18,
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

  Widget _buildQuickAction(String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 16),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
