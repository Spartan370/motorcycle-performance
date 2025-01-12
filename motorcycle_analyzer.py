import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from dataclasses import dataclass
from typing import List, Dict, Optional
import json
import plotly.graph_objects as go
from scipy import stats

@dataclass
class MotorcyclePart:
    name: str
    cost: float
    hp_gain: float
    weight_reduction: float
    stage: int
    installation_time: float
    compatibility: List[str]
    manufacturer: str
    
class MotorcyclePerformanceAnalyzer:
    def __init__(self):
        self.bikes = {
            "Yamaha R1": {
                "base_hp": 200,
                "base_weight": 201,
                "price": 17599
            },
            "Ducati V4": {
                "base_hp": 214,
                "base_weight": 195,
                "price": 23895
            }
        }
        
        self.performance_data = self._initialize_performance_data()
        self.upgrade_combinations = self._calculate_upgrade_paths()
        
    def _initialize_performance_data(self) -> pd.DataFrame:
        data = []
        for stage in range(1, 4):
            for bike in self.bikes.keys():
                parts = self._generate_stage_parts(stage, bike)
                for part in parts:
                    data.append({
                        "bike": bike,
                        "stage": stage,
                        "part": part.name,
                        "cost": part.cost,
                        "hp_gain": part.hp_gain,
                        "weight_reduction": part.weight_reduction,
                        "installation_time": part.installation_time,
                        "manufacturer": part.manufacturer
                    })
        return pd.DataFrame(data)
    
    def _generate_stage_parts(self, stage: int, bike: str) -> List[MotorcyclePart]:
        parts = []
        manufacturers = ["Akrapovič", "Öhlins", "Brembo", "BST", "Marchesini"]
        
        if stage == 1:
            parts.extend([
                MotorcyclePart("Quick Shifter", 699.99, 0, 0.2, 1, 2, [bike], "Translogic"),
                MotorcyclePart("Air Filter", 89.99, 2, 0.1, 1, 0.5, [bike], "K&N"),
                MotorcyclePart("ECU Flash", 499.99, 5, 0, 1, 1, [bike], "Woolich Racing")
            ])
        elif stage == 2:
            parts.extend([
                MotorcyclePart("Full Exhaust", 2499.99, 8, 4.5, 2, 3, [bike], "Akrapovič"),
                MotorcyclePart("Race ECU", 1499.99, 10, 0, 2, 2, [bike], "GET"),
                MotorcyclePart("Brake Upgrade", 1299.99, 0, 1.2, 2, 4, [bike], "Brembo")
            ])
        else:
            parts.extend([
                MotorcyclePart("Carbon Wheels", 3999.99, 0, 3.8, 3, 4, [bike], "BST"),
                MotorcyclePart("Race Suspension", 4499.99, 0, 1.5, 3, 6, [bike], "Öhlins"),
                MotorcyclePart("Power Commander", 899.99, 12, 0, 3, 2, [bike], "Dynojet")
            ])
        return parts

    def calculate_performance_metrics(self, bike: str, upgrades: List[MotorcyclePart]) -> Dict:
        base = self.bikes[bike]
        total_hp = base["base_hp"]
        total_weight = base["base_weight"]
        total_cost = base["price"]
        
        for upgrade in upgrades:
            total_hp += upgrade.hp_gain
            total_weight -= upgrade.weight_reduction
            total_cost += upgrade.cost
            
        power_to_weight = total_hp / (total_weight / 220.462)  # Convert kg to lbs
        return {
            "final_hp": total_hp,
            "final_weight": total_weight,
            "total_cost": total_cost,
            "power_to_weight": power_to_weight
        }

    def plot_performance_comparison(self):
        fig = go.Figure()
        
        for bike in self.bikes.keys():
            bike_data = self.performance_data[self.performance_data["bike"] == bike]
            
            fig.add_trace(go.Scatter(
                x=bike_data["cost"],
                y=bike_data["hp_gain"],
                name=bike,
                mode="markers+text",
                marker=dict(size=10, symbol="circle"),
                text=bike_data["part"],
                textposition="top center"
            ))
            
        fig.update_layout(
            title="Cost vs Performance Gains by Motorcycle",
            xaxis_title="Cost ($)",
            yaxis_title="Horsepower Gain",
            template="plotly_dark",
            showlegend=True
        )
        return fig

    def generate_upgrade_report(self, bike: str, budget: float) -> str:
        optimal_upgrades = self._find_optimal_upgrades(bike, budget)
        metrics = self.calculate_performance_metrics(bike, optimal_upgrades)
        
        report = f"""
        PERFORMANCE UPGRADE REPORT
        -------------------------
        Motorcycle: {bike}
        Budget: ${budget:,.2f}
        
        Recommended Upgrades:
        """
        
        for upgrade in optimal_upgrades:
            report += f"\n- {upgrade.name} (Stage {upgrade.stage})"
            report += f"\n  Cost: ${upgrade.cost:,.2f}"
            report += f"\n  HP Gain: {upgrade.hp_gain}"
            report += f"\n  Weight Reduction: {upgrade.weight_reduction}kg"
            
        report += f"""
        
        Final Specifications:
        - Horsepower: {metrics['final_hp']}hp
        - Weight: {metrics['final_weight']}kg
        - Power-to-Weight: {metrics['power_to_weight']:.2f} hp/lb
        - Total Investment: ${metrics['total_cost']:,.2f}
        """
        
        return report

    def _find_optimal_upgrades(self, bike: str, budget: float) -> List[MotorcyclePart]:
        bike_parts = self.performance_data[self.performance_data["bike"] == bike]
        optimal = []
        remaining_budget = budget
        
        for _, part in bike_parts.sort_values(by="hp_gain", ascending=False).iterrows():
            if part["cost"] <= remaining_budget:
                optimal.append(MotorcyclePart(
                    part["part"], part["cost"], part["hp_gain"],
                    part["weight_reduction"], part["stage"],
                    part["installation_time"], [bike], part["manufacturer"]
                ))
                remaining_budget -= part["cost"]
                
        return optimal

analyzer = MotorcyclePerformanceAnalyzer()
report = analyzer.generate_upgrade_report("Ducati V4", 15000)
print(report)

fig = analyzer.plot_performance_comparison()
fig.show()
