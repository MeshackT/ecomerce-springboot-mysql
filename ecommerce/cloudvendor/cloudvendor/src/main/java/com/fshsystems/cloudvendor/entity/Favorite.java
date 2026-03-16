package com.fshsystems.cloudvendor.entity;
import jakarta.persistence.*;

@Entity
@Table(name="favorites", uniqueConstraints = @UniqueConstraint(columnNames = {"user_Id","product_Id"})
)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long productId;

    public Favorite(){}

    public Favorite(Long userId, Long productId){
        this.userId = userId;
        this.productId = productId;
    }

    public Long getId(){ return id; }
    public Long getUserId(){ return userId; }
    public Long getProductId(){ return productId; }

    public void setUserId(Long userId){ this.userId = userId; }
    public void setProductId(Long productId){ this.productId = productId; }
}