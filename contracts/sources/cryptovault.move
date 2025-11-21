module cryptovault::marketplace {
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string::{String};

    // Events
    public struct DatasetListed has copy, drop {
        dataset_id: ID,
        seller: address,
        price: u64,
    }

    public struct DatasetPurchased has copy, drop {
        dataset_id: ID,
        buyer: address,
        seller: address,
        price: u64,
    }

    // Objects
    public struct Dataset has key, store {
        id: UID,
        seller: address,
        title: String,
        price: u64,
        data_hash: vector<u8>,
        zk_proof: vector<u8>,
        purchase_count: u64,
    }

    public struct Marketplace has key {
        id: UID,
        owner: address,
        total_volume: u64,
    }

    // Admin Functions
    public fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            total_volume: 0,
        };
        transfer::share_object(marketplace);
    }

    // Seller Functions
    public fun list_dataset(
        marketplace: &mut Marketplace,
        title: String,
        price: u64,
        data_hash: vector<u8>,
        zk_proof: vector<u8>,
        ctx: &mut TxContext,
    ): ID {
        let dataset = Dataset {
            id: object::new(ctx),
            seller: tx_context::sender(ctx),
            title,
            price,
            data_hash,
            zk_proof,
            purchase_count: 0,
        };
        
        let dataset_id = object::uid_to_inner(&dataset.id);
        event::emit(DatasetListed {
            dataset_id,
            seller: dataset.seller,
            price: dataset.price,
        });

        transfer::share_object(dataset);
        dataset_id
    }

    // Buyer Functions
    public fun purchase_dataset(
        marketplace: &mut Marketplace,
        dataset: &mut Dataset,
        payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        let amount = coin::value(&payment);
        assert!(amount >= dataset.price, 0); // Insufficient payment

        // Send payment to seller
        transfer::public_transfer(payment, dataset.seller);

        // Emit event
        let dataset_id = object::uid_to_inner(&dataset.id);
        event::emit(DatasetPurchased {
            dataset_id,
            buyer: tx_context::sender(ctx),
            seller: dataset.seller,
            price: dataset.price,
        });

        // Update stats
        dataset.purchase_count = dataset.purchase_count + 1;
        marketplace.total_volume = marketplace.total_volume + dataset.price;
    }

    // Query Functions
    public fun get_dataset_price(dataset: &Dataset): u64 {
        dataset.price
    }

    public fun get_dataset_purchases(dataset: &Dataset): u64 {
        dataset.purchase_count
    }

    public fun get_seller(dataset: &Dataset): address {
        dataset.seller
    }
}
