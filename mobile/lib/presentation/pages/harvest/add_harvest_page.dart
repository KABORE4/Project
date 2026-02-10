import 'package:flutter/material.dart';

class AddHarvestPage extends StatefulWidget {
  const AddHarvestPage({super.key});

  @override
  State<AddHarvestPage> createState() => _AddHarvestPageState();
}

class _AddHarvestPageState extends State<AddHarvestPage> {
  final _formKey = GlobalKey<FormState>();
  final _cropController = TextEditingController();
  final _quantityController = TextEditingController();
  final _dateController = TextEditingController();
  String _selectedUnit = 'kg';
  String _selectedQuality = 'A';

  @override
  void dispose() {
    _cropController.dispose();
    _quantityController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  void _saveHarvest() {
    if (_formKey.currentState?.validate() ?? false) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Harvest saved successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      _formKey.currentState?.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Harvest'),
        backgroundColor: const Color(0xFF2E7D32),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2E7D32), Color(0xFF4CAF50)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.agriculture, color: Colors.white, size: 40),
                    SizedBox(height: 12),
                    Text(
                      'Record Your Harvest',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Add details about your crop harvest',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Form Fields
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _cropController,
                        decoration: const InputDecoration(
                          labelText: 'Crop Type',
                          prefixIcon: Icon(Icons.grass),
                          hintText: 'e.g., Corn, Wheat, Rice',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter crop type';
                          }
                          return null;
                        },
                      ),
                      
                      const SizedBox(height: 20),
                      
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _quantityController,
                              keyboardType: TextInputType.number,
                              decoration: const InputDecoration(
                                labelText: 'Quantity',
                                prefixIcon: Icon(Icons.scale),
                                hintText: 'Enter quantity',
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Please enter quantity';
                                }
                                if (double.tryParse(value) == null || double.tryParse(value)! <= 0) {
                                  return 'Please enter a valid quantity';
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          SizedBox(
                            width: 120,
                            child: DropdownButtonFormField<String>(
                              value: _selectedUnit,
                              decoration: const InputDecoration(
                                labelText: 'Unit',
                                border: OutlineInputBorder(),
                              ),
                              items: ['kg', 'tons', 'bags'].map((unit) {
                                return DropdownMenuItem(value: unit, child: Text(unit));
                              }).toList(),
                              onChanged: (value) {
                                setState(() {
                                  _selectedUnit = value!;
                                });
                              },
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 20),
                      
                      DropdownButtonFormField<String>(
                        value: _selectedQuality,
                        decoration: const InputDecoration(
                          labelText: 'Quality Grade',
                          prefixIcon: Icon(Icons.grade),
                          border: OutlineInputBorder(),
                        ),
                        items: ['A', 'B', 'C', 'D'].map((quality) {
                          return DropdownMenuItem(
                            value: quality,
                            child: Row(
                              children: [
                                Text('Grade $quality'),
                                const Spacer(),
                                Icon(
                                  Icons.star,
                                  color: quality == 'A' ? Colors.amber : 
                                         quality == 'B' ? Colors.grey :
                                         quality == 'C' ? Colors.brown : Colors.red,
                                  size: 16,
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedQuality = value!;
                          });
                        },
                      ),
                      
                      const SizedBox(height: 20),
                      
                      TextFormField(
                        controller: _dateController,
                        readOnly: true,
                        decoration: InputDecoration(
                          labelText: 'Harvest Date',
                          prefixIcon: const Icon(Icons.calendar_today),
                          hintText: 'Select harvest date',
                          border: const OutlineInputBorder(),
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.calendar_month),
                            onPressed: () async {
                              final DateTime? picked = await showDatePicker(
                                context: context,
                                initialDate: DateTime.now(),
                                firstDate: DateTime(2020),
                                lastDate: DateTime.now().add(const Duration(days: 30)),
                              );
                              if (picked != null) {
                                setState(() {
                                  _dateController.text = '${picked.day}/${picked.month}/${picked.year}';
                                });
                              }
                            },
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please select harvest date';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Recent Harvests Summary
              const Text(
                'Recent Harvests',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF2E7D32),
                ),
              ),
              const SizedBox(height: 16),
              
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: Column(
                  children: [
                    _buildRecentHarvest('Corn', '500 kg', 'Grade A', '15 Mar 2024'),
                    _buildRecentHarvest('Wheat', '350 kg', 'Grade B', '10 Mar 2024'),
                    _buildRecentHarvest('Rice', '200 kg', 'Grade A', '5 Mar 2024'),
                  ],
                ),
              ),
              
              const SizedBox(height: 32),
              
              // Save Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _saveHarvest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2E7D32),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 4,
                  ),
                  child: const Text(
                    'Save Harvest',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentHarvest(String crop, String quantity, String grade, String date) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: Colors.green[100],
        child: Icon(Icons.grass, color: Colors.green[700]),
      ),
      title: Text(crop, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text('$grade • $date'),
      trailing: Text(
        quantity,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          color: Color(0xFF2E7D32),
        ),
      ),
    );
  }
}
