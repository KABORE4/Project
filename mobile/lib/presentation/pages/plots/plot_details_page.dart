import 'package:flutter/material.dart';

class PlotDetailsPage extends StatefulWidget {
  final Map<String, dynamic> plot;

  const PlotDetailsPage({super.key, required this.plot});

  @override
  State<PlotDetailsPage> createState() => _PlotDetailsPageState();
}

class _PlotDetailsPageState extends State<PlotDetailsPage> {
  final _plotNameController = TextEditingController();
  final _sizeController = TextEditingController();
  final _locationController = TextEditingController();
  final _cropController = TextEditingController();
  final _notesController = TextEditingController();
  String _selectedStatus = 'Active';
  String _selectedSoilType = 'Loamy';
  bool _isEditing = false;

  final List<Map<String, dynamic>> _history = [
    {
      'date': '15 Mar 2024',
      'action': 'Planted Corn',
      'details': 'Hybrid corn variety planted, expected yield: 8 tons/ha',
      'type': 'planting'
    },
    {
      'date': '10 Mar 2024',
      'action': 'Soil Preparation',
      'details': 'Tilling and fertilization completed with NPK 15-15-15',
      'type': 'maintenance'
    },
    {
      'date': '1 Mar 2024',
      'action': 'Irrigation Check',
      'details': 'Irrigation system inspected and repaired minor leaks',
      'type': 'maintenance'
    },
    {
      'date': '15 Feb 2024',
      'action': 'Soil Testing',
      'details': 'pH: 6.5, Organic matter: 3.2%, Nitrogen: Medium',
      'type': 'testing'
    },
  ];

  @override
  void initState() {
    super.initState();
    _initializeControllers();
  }

  void _initializeControllers() {
    _plotNameController.text = widget.plot['name'] ?? '';
    _sizeController.text = widget.plot['size']?.toString() ?? '';
    _locationController.text = widget.plot['location'] ?? '';
    _cropController.text = widget.plot['crop'] ?? '';
    _notesController.text = widget.plot['notes'] ?? '';
    _selectedStatus = widget.plot['status'] ?? 'Active';
    _selectedSoilType = widget.plot['soilType'] ?? 'Loamy';
  }

  @override
  void dispose() {
    _plotNameController.dispose();
    _sizeController.dispose();
    _locationController.dispose();
    _cropController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _toggleEdit() {
    setState(() {
      _isEditing = !_isEditing;
    });
  }

  void _saveChanges() {
    setState(() {
      _isEditing = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Plot updated successfully!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _showHistory() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.history, color: Colors.blue),
                  const SizedBox(width: 8),
                  const Text(
                    'Plot History',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: _history.length,
                  itemBuilder: (context, index) {
                    final entry = _history[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  _getHistoryIcon(entry['type']),
                                  color: _getHistoryColor(entry['type']),
                                  size: 20,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  entry['date'],
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              entry['action'],
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              entry['details'],
                              style: TextStyle(
                                color: Colors.grey[700],
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getHistoryIcon(String type) {
    switch (type) {
      case 'planting':
        return Icons.grass;
      case 'maintenance':
        return Icons.build;
      case 'testing':
        return Icons.science;
      default:
        return Icons.info;
    }
  }

  Color _getHistoryColor(String type) {
    switch (type) {
      case 'planting':
        return Colors.green;
      case 'maintenance':
        return Colors.orange;
      case 'testing':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEditableField({
    required String label,
    required TextEditingController controller,
    String? hintText,
    TextInputType? keyboardType,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 4),
          TextField(
            controller: controller,
            enabled: _isEditing,
            keyboardType: keyboardType,
            decoration: InputDecoration(
              hintText: hintText,
              border: _isEditing ? const OutlineInputBorder() : InputBorder.none,
              enabledBorder: _isEditing ? const OutlineInputBorder() : InputBorder.none,
              filled: _isEditing,
              fillColor: _isEditing ? Colors.grey[50] : Colors.transparent,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.plot['name'] ?? 'Plot Details'),
        backgroundColor: const Color(0xFF2196F3),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: _showHistory,
            icon: const Icon(Icons.history),
            tooltip: 'View History',
          ),
          IconButton(
            onPressed: _toggleEdit,
            icon: Icon(_isEditing ? Icons.save : Icons.edit),
            tooltip: _isEditing ? 'Save' : 'Edit',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _getStatusColor(widget.plot['status']),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                widget.plot['status'] ?? 'Unknown',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Plot Information Card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Plot Information',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    if (_isEditing) ...[
                      _buildEditableField(
                        label: 'Plot Name',
                        controller: _plotNameController,
                        hintText: 'Enter plot name',
                      ),
                      _buildEditableField(
                        label: 'Size (hectares)',
                        controller: _sizeController,
                        hintText: 'Enter plot size',
                        keyboardType: TextInputType.number,
                      ),
                      _buildEditableField(
                        label: 'Location',
                        controller: _locationController,
                        hintText: 'Enter location',
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Soil Type',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 4),
                            DropdownButtonFormField<String>(
                              value: _selectedSoilType,
                              decoration: InputDecoration(
                                border: _isEditing ? const OutlineInputBorder() : InputBorder.none,
                                filled: _isEditing,
                                fillColor: _isEditing ? Colors.grey[50] : Colors.transparent,
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
                          ],
                        ),
                      ),
                      _buildEditableField(
                        label: 'Current Crop',
                        controller: _cropController,
                        hintText: 'Enter current crop',
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Status',
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 4),
                            DropdownButtonFormField<String>(
                              value: _selectedStatus,
                              decoration: InputDecoration(
                                border: _isEditing ? const OutlineInputBorder() : InputBorder.none,
                                filled: _isEditing,
                                fillColor: _isEditing ? Colors.grey[50] : Colors.transparent,
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
                      _buildEditableField(
                        label: 'Notes',
                        controller: _notesController,
                        hintText: 'Enter additional notes',
                      ),
                    ] else ...[
                      _buildDetailRow('Plot Name', widget.plot['name'] ?? 'N/A'),
                      _buildDetailRow('Size', '${widget.plot['size']} ha'),
                      _buildDetailRow('Location', widget.plot['location'] ?? 'N/A'),
                      _buildDetailRow('Soil Type', widget.plot['soilType'] ?? 'N/A'),
                      _buildDetailRow('Current Crop', widget.plot['crop'] ?? 'N/A'),
                      _buildDetailRow('Status', widget.plot['status'] ?? 'N/A'),
                      _buildDetailRow('Last Planted', widget.plot['lastPlanted'] ?? 'N/A'),
                      _buildDetailRow('Expected Harvest', widget.plot['expectedHarvest'] ?? 'N/A'),
                      _buildDetailRow('Health', widget.plot['health'] ?? 'N/A'),
                      const SizedBox(height: 16),
                      const Text(
                        'Notes',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        widget.plot['notes'] ?? 'No notes available',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Progress Card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Growth Progress',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    LinearProgressIndicator(
                      value: widget.plot['progress']?.toDouble() ?? 0.0,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(
                        _getProgressColor(widget.plot['progress']?.toDouble() ?? 0.0),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${((widget.plot['progress']?.toDouble() ?? 0.0) * 100).toInt()}% Complete',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            if (_isEditing) ...[
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _saveChanges,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Save Changes'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: _toggleEdit,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text('Cancel'),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'Active':
        return Colors.green;
      case 'Fallow':
        return Colors.grey;
      case 'Under Preparation':
        return Colors.orange;
      default:
        return Colors.blue;
    }
  }

  Color _getProgressColor(double progress) {
    if (progress < 0.3) return Colors.red;
    if (progress < 0.7) return Colors.orange;
    return Colors.green;
  }
}
