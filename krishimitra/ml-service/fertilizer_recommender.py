import pandas as pd
import json
from datetime import datetime, timedelta

class FertilizerRecommender:
    def __init__(self):
        # Load crop nutrient requirements database
        self.crop_requirements = self._load_crop_requirements()
        # Load fertilizer database
        self.fertilizers = self._load_fertilizers()
        # Soil type nutrient profiles
        self.soil_profiles = self._load_soil_profiles()
    
    def _load_crop_requirements(self):
        """NPK requirements for different crops (kg/acre)"""
        return {
            'Wheat': {'N': 60, 'P': 30, 'K': 20, 'stages': 3},
            'Rice': {'N': 50, 'P': 25, 'K': 25, 'stages': 3},
            'Cotton': {'N': 60, 'P': 30, 'K': 30, 'stages': 4},
            'Soybean': {'N': 25, 'P': 40, 'K': 20, 'stages': 3},
            'Maize': {'N': 60, 'P': 30, 'K': 25, 'stages': 3},
            'Sugarcane': {'N': 100, 'P': 50, 'K': 60, 'stages': 4},
            'Groundnut': {'N': 15, 'P': 35, 'K': 25, 'stages': 3},
            'Potato': {'N': 70, 'P': 35, 'K': 70, 'stages': 3},
            'Tomato': {'N': 80, 'P': 40, 'K': 60, 'stages': 4},
            'Onion': {'N': 50, 'P': 25, 'K': 50, 'stages': 3}
        }
    
    def _load_fertilizers(self):
        """Fertilizer products database"""
        return [
            {'name': 'Urea', 'npk': (46, 0, 0), 'type': 'chemical', 'price': 6.5},
            {'name': 'DAP', 'npk': (18, 46, 0), 'type': 'chemical', 'price': 27.0},
            {'name': 'MOP', 'npk': (0, 0, 60), 'type': 'chemical', 'price': 18.0},
            {'name': 'NPK 10:26:26', 'npk': (10, 26, 26), 'type': 'chemical', 'price': 22.0},
            {'name': 'NPK 20:20:0', 'npk': (20, 20, 0), 'type': 'chemical', 'price': 20.0},
            {'name': 'SSP', 'npk': (0, 16, 0), 'type': 'chemical', 'price': 8.5},
            {'name': 'Vermicompost', 'npk': (1.5, 1, 1), 'type': 'organic', 'price': 6.0},
            {'name': 'FYM', 'npk': (0.5, 0.2, 0.5), 'type': 'organic', 'price': 2.5},
            {'name': 'Neem Cake', 'npk': (5, 1, 2), 'type': 'organic', 'price': 25.0}
        ]
    
    def _load_soil_profiles(self):
        """Typical nutrient levels by soil type"""
        return {
            'Black soil': {'N': 0.5, 'P': 0.3, 'K': 0.7},
            'Red soil': {'N': 0.3, 'P': 0.2, 'K': 0.5},
            'Alluvial soil': {'N': 0.6, 'P': 0.4, 'K': 0.6},
            'Laterite soil': {'N': 0.2, 'P': 0.1, 'K': 0.3},
            'Clay soil': {'N': 0.5, 'P': 0.4, 'K': 0.6}
        }
    
    def recommend(self, crop_name, soil_type, land_size, growth_stage, 
                  soil_test=None, prefer_organic=False, budget=None, season='Kharif'):
        """
        Generate fertilizer recommendation
        """
        
        # Get crop requirements
        if crop_name not in self.crop_requirements:
            # Try to match case or partial
            matched = False
            for c in self.crop_requirements:
                if c.lower() in crop_name.lower():
                    crop_name = c
                    matched = True
                    break
            
            if not matched:
                return {'error': f'Crop {crop_name} not in database', 'available_crops': list(self.crop_requirements.keys())}
        
        crop_req = self.crop_requirements[crop_name]
        
        # Calculate nutrient needs
        nutrient_needs = self._calculate_nutrient_needs(
            crop_req, 
            soil_type, 
            land_size, 
            soil_test
        )
        
        # Select fertilizers based on preference
        if prefer_organic:
            selected_fertilizers = [f for f in self.fertilizers if f['type'] == 'organic']
        else:
            selected_fertilizers = self.fertilizers
        
        # Generate application schedule
        schedule = self._generate_schedule(
            nutrient_needs, 
            selected_fertilizers, 
            growth_stage, 
            crop_req.get('stages', 3),
            land_size
        )
        
        # Calculate total cost
        total_cost = sum(item['cost'] for item in schedule)
        
        # Budget check (if budget is provided and greater than 0)
        if budget and budget > 0 and total_cost > budget:
            schedule = self._optimize_for_budget(schedule, budget)
            total_cost = sum(item['cost'] for item in schedule)
        
        # Expected yield improvement
        yield_increase = self._calculate_yield_impact(nutrient_needs, soil_test)
        
        # Generate tips
        tips = self._generate_tips(crop_name, soil_type, season, soil_test)
        
        return {
            'fertilizer_plan': schedule,
            'total_cost': round(total_cost, 2),
            'expected_yield_increase': round(yield_increase, 2),
            'schedule': self._format_schedule(schedule, growth_stage),
            'tips': tips,
            'nutrient_summary': nutrient_needs
        }
    
    def _calculate_nutrient_needs(self, crop_req, soil_type, land_size, soil_test):
        """Calculate actual nutrient requirements"""
        
        # Base requirements
        n_need = crop_req['N'] * land_size
        p_need = crop_req['P'] * land_size
        k_need = crop_req['K'] * land_size
        
        # Adjust based on soil type
        if soil_type in self.soil_profiles:
            profile = self.soil_profiles[soil_type]
            n_need *= (1 - profile['N'])  # Reduce if soil has N
            p_need *= (1 - profile['P'])
            k_need *= (1 - profile['K'])
        
        # Adjust based on soil test (if available)
        if soil_test:
            # Convert soil test levels to nutrient availability (0-1 scale)
            # Safe parsing
            try:
                val_n = float(soil_test.get('nitrogen', 0))
                val_p = float(soil_test.get('phosphorus', 0))
                val_k = float(soil_test.get('potassium', 0))
                
                n_availability = min(val_n / 560, 1.0)
                p_availability = min(val_p / 25, 1.0)
                k_availability = min(val_k / 280, 1.0)
                
                n_need *= (1 - n_availability)
                p_need *= (1 - p_availability)
                k_need *= (1 - k_availability)
            except:
                pass
        
        return {
            'nitrogen': round(n_need, 2),
            'phosphorus': round(p_need, 2),
            'potassium': round(k_need, 2)
        }
    
    def _generate_schedule(self, nutrient_needs, fertilizers, current_stage, total_stages, land_size):
        """Generate stage-wise fertilizer application schedule"""
        
        schedule = []
        
        # Find best fertilizers for N, P, K
        # Logic simplified: Use DAP for P (+N), Urea for remaining N, MOP for K
        
        # Need P? Use DAP
        p_needed = nutrient_needs['phosphorus']
        dap_qty = 0
        if p_needed > 0:
            dap = next((f for f in fertilizers if f['name'] == 'DAP'), None)
            if not dap:
                 # Fallback to SSP or Organic if DAP unavailable (e.g. organic mode)
                 dap = next((f for f in fertilizers if f['npk'][1] > 10), None)
            
            if dap:
                p_content = dap['npk'][1] / 100.0
                dap_qty = p_needed / p_content if p_content > 0 else 0
                
                schedule.append({
                    'stage': 'Basal (Before Sowing)',
                    'fertilizer': dap['name'],
                    'fertilizer_id': None, # Populated by different key if needed
                    'quantity_kg': round(dap_qty, 2),
                    'quantity_per_acre': round(dap_qty / land_size, 2) if land_size else 0,
                    'cost': round(dap_qty * dap['price'], 2),
                    'application_method': 'Broadcast' if 'Broadcast' in dap.get('application_method', []) else 'Basal application',
                    'instructions': self._get_application_instructions('Basal application', dap['name']),
                    'timing': 'At sowing time',
                    'npk_provided': {
                        'N': round(dap_qty * (dap['npk'][0]/100), 2), 
                        'P': round(dap_qty * (dap['npk'][1]/100), 2), 
                        'K': round(dap_qty * (dap['npk'][2]/100), 2)
                    }
                })
        
        # Check N provided by DAP
        n_provided_by_dap = 0
        if schedule:
            n_provided_by_dap = schedule[0]['npk_provided']['N']
            
        n_needed = max(0, nutrient_needs['nitrogen'] - n_provided_by_dap)
        
        # Need K? Use MOP
        k_needed = nutrient_needs['potassium']
        if k_needed > 0:
            mop = next((f for f in fertilizers if f['name'] == 'MOP'), None)
            if not mop:
                mop = next((f for f in fertilizers if f['npk'][2] > 10), None)
                
            if mop:
                k_content = mop['npk'][2] / 100.0
                mop_qty = k_needed / k_content if k_content > 0 else 0
                
                # Split K: 1/3 basal, 2/3 later
                mop_basal = mop_qty / 3
                mop_top = mop_qty * 2/3
                
                schedule.append({
                    'stage': 'Basal (Before Sowing)',
                    'fertilizer': mop['name'],
                    'quantity_kg': round(mop_basal, 2),
                    'quantity_per_acre': round(mop_basal / land_size, 2) if land_size else 0,
                    'cost': round(mop_basal * mop['price'], 2),
                    'application_method': 'Basal application',
                    'instructions': self._get_application_instructions('Basal application', mop['name']),
                    'timing': 'At sowing time',
                    'npk_provided': {'N': 0, 'P': 0, 'K': round(mop_basal * k_content, 2)}
                })
                
                schedule.append({
                    'stage': 'Second Top-dressing (45-60 days)',
                    'fertilizer': mop['name'],
                    'quantity_kg': round(mop_top, 2),
                    'quantity_per_acre': round(mop_top / land_size, 2) if land_size else 0,
                    'cost': round(mop_top * mop['price'], 2),
                    'application_method': 'Top dressing',
                    'instructions': self._get_application_instructions('Top dressing', mop['name']),
                    'timing': '45-60 days after sowing',
                    'npk_provided': {'N': 0, 'P': 0, 'K': round(mop_top * k_content, 2)}
                })

        # Need N? Use Urea (split into doses)
        if n_needed > 0:
            urea = next((f for f in fertilizers if f['name'] == 'Urea'), None)
            if not urea:
                urea = next((f for f in fertilizers if f['npk'][0] > 10), None)
                
            if urea:
                n_content = urea['npk'][0] / 100.0
                urea_qty = n_needed / n_content if n_content > 0 else 0
                
                # Split N: 2 or 3 splits depending on crop
                splits = 2
                qty_per_split = urea_qty / splits
                
                schedule.append({
                    'stage': 'First Top-dressing (21-30 days)',
                    'fertilizer': urea['name'],
                    'quantity_kg': round(qty_per_split, 2),
                    'quantity_per_acre': round(qty_per_split / land_size, 2) if land_size else 0,
                    'cost': round(qty_per_split * urea['price'], 2),
                    'application_method': 'Side dressing',
                    'instructions': self._get_application_instructions('Side dressing', urea['name']),
                    'timing': '21-30 days after sowing',
                    'npk_provided': {'N': round(qty_per_split * n_content, 2), 'P': 0, 'K': 0}
                })
                
                schedule.append({
                    'stage': 'Second Top-dressing (45-60 days)',
                    'fertilizer': urea['name'],
                    'quantity_kg': round(qty_per_split, 2),
                    'quantity_per_acre': round(qty_per_split / land_size, 2) if land_size else 0,
                    'cost': round(qty_per_split * urea['price'], 2),
                    'application_method': 'Top dressing',
                    'instructions': self._get_application_instructions('Top dressing', urea['name']),
                    'timing': '45-60 days after sowing',
                    'npk_provided': {'N': round(qty_per_split * n_content, 2), 'P': 0, 'K': 0}
                })
        
        return schedule
    
    def _optimize_for_budget(self, schedule, budget):
        """Adjust fertilizer plan to fit budget"""
        current_total = sum(item['cost'] for item in schedule)
        if current_total <= 0: return schedule
        
        reduction_factor = budget / current_total
        
        for item in schedule:
            item['quantity_kg'] = round(item['quantity_kg'] * reduction_factor, 2)
            item['quantity_per_acre'] = round(item['quantity_per_acre'] * reduction_factor, 2)
            item['cost'] = round(item['cost'] * reduction_factor, 2)
            item['npk_provided'] = {k: round(v * reduction_factor, 2) for k, v in item['npk_provided'].items()}
        
        return schedule
    
    def _calculate_yield_impact(self, nutrient_needs, soil_test):
        """Estimate yield improvement from fertilization"""
        
        # Simplified improvement logic
        base_improvement = 10
        if soil_test:
            # If soil was poor, improvement is higher
             base_improvement += 5
        
        return min(base_improvement + 5, 25) 
    
    def _format_schedule(self, schedule, current_stage):
        """Format schedule with actionable dates"""
        formatted = []
        for item in schedule:
            formatted.append({
                **item,
                'actionable': self._is_actionable(item['stage'], current_stage),
                'days_from_now': self._days_until_application(item['stage'], current_stage)
            })
        return formatted
    
    def _is_actionable(self, schedule_stage, current_stage):
        """Check if this application is currently actionable"""
        # Simple string match logic
        if 'Basal' in schedule_stage and current_stage in ['Sowing', 'Pre-sowing']: return True
        if 'First' in schedule_stage and current_stage == 'Vegetative': return True
        return False
    
    def _get_application_instructions(self, method, fertilizer_name):
        """Get detailed application instructions"""
        instructions = {
            'Basal application': "Broadcast uniformly on the soil surface before sowing/planting and incorporate into the top 10-15 cm of soil.",
            'Broadcast': "Spread evenly across the field by hand or spreader.",
            'Top dressing': "Apply near the root zone when the soil is moist. Avoid applying on wet foliage to prevent scorching.",
            'Side dressing': "Apply in bands 5-10 cm away from the plant row and slightly below the soil surface.",
            'Foliar': "Dissolve in water and spray on leaves during cooler parts of the day (morning/evening).",
            'Seed treatment': "Mix with seeds using a sticking agent (like jaggery solution) and dry in shade before sowing."
        }
        
        base_instruction = instructions.get(method, "Apply as per standard agricultural practices.")
        
        if "Urea" in fertilizer_name:
            base_instruction += " Ensure soil moisture is adequate to minimize volatilization losses."
        if "DAP" in fertilizer_name:
            base_instruction += " Do not mix directly with seeds to avoid germination issues."
            
        return base_instruction

    def _days_until_application(self, schedule_stage, current_stage):
        """Estimate days until this application"""
        # Simplified values
        if 'Basal' in schedule_stage: return 0
        if 'First' in schedule_stage: return 25
        if 'Second' in schedule_stage: return 50
        return -1
    
    def _generate_tips(self, crop_name, soil_type, season, soil_test):
        """Generate contextual fertilizer application tips"""
        tips = []
        tips.append("Always apply fertilizers in moist soil")
        tips.append("Split nitrogen application helps reduce losses")
        
        if season == 'Kharif':
            tips.append("During monsoon, apply urea in split doses to prevent leaching")
        
        if soil_type == 'Black soil':
            tips.append("Black soil retains nutrients well")
        
        return tips
