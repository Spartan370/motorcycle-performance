use actix_web::{web, App, HttpResponse, HttpServer};
use serde::{Deserialize, Serialize};
use tokio;
use std::collections::HashMap;
use std::sync::Arc;
use parking_lot::RwLock;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Motorcycle {
    model: String,
    base_hp: u32,
    weight_kg: f32,
    upgrades: Vec<Upgrade>,
    total_cost: f32,
    performance_index: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Upgrade {
    name: String,
    manufacturer: String,
    stage: u8,
    cost: f32,
    hp_gain: f32,
    weight_reduction: f32,
    installation_time: f32,
}

struct AppState {
    motorcycles: Arc<RwLock<HashMap<String, Motorcycle>>>,
}

impl Motorcycle {
    fn calculate_performance(&mut self) {
        let total_hp = self.base_hp as f32 + 
            self.upgrades.iter().map(|u| u.hp_gain).sum::<f32>();
        let final_weight = self.weight_kg - 
            self.upgrades.iter().map(|u| u.weight_reduction).sum::<f32>();
        self.performance_index = total_hp / final_weight * 100.0;
        self.total_cost = self.upgrades.iter().map(|u| u.cost).sum();
    }

    fn add_upgrade(&mut self, upgrade: Upgrade) -> Result<(), String> {
        if self.upgrades.len() >= 10 {
            return Err("Maximum upgrades reached".to_string());
        }
        self.upgrades.push(upgrade);
        self.calculate_performance();
        Ok(())
    }

    fn remove_upgrade(&mut self, upgrade_name: &str) -> Result<(), String> {
        if let Some(pos) = self.upgrades.iter().position(|u| u.name == upgrade_name) {
            self.upgrades.remove(pos);
            self.calculate_performance();
            Ok(())
        } else {
            Err("Upgrade not found".to_string())
        }
    }
}

async fn get_motorcycle(
    data: web::Data<AppState>,
    path: web::Path<String>,
) -> HttpResponse {
    let motorcycles = data.motorcycles.read();
    if let Some(bike) = motorcycles.get(&path.into_inner()) {
        HttpResponse::Ok().json(bike)
    } else {
        HttpResponse::NotFound().finish()
    }
}

async fn add_upgrade(
    data: web::Data<AppState>,
    path: web::Path<String>,
    upgrade: web::Json<Upgrade>,
) -> HttpResponse {
    let mut motorcycles = data.motorcycles.write();
    if let Some(bike) = motorcycles.get_mut(&path.into_inner()) {
        match bike.add_upgrade(upgrade.into_inner()) {
            Ok(_) => HttpResponse::Ok().json(bike),
            Err(e) => HttpResponse::BadRequest().body(e),
        }
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        motorcycles: Arc::new(RwLock::new(HashMap::new())),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/motorcycle/{id}", web::get().to(get_motorcycle))
            .route("/motorcycle/{id}/upgrade", web::post().to(add_upgrade))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
