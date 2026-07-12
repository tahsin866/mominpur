package com.example.project.address.Model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Table(name = "thana", schema = "public")
@Data
public class Thana {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thana_id")
    private Integer thanaId;

    @Column(name = "thana_name")
    private String thanaName;
    
    private String thana;
    private Integer tid;

    @Column(name = "user_name")
    private String userName;
    
    @Column(name = "ent_date")
    private ZonedDateTime entDate;
    
    @Column(name = "ent_year")
    private Integer entYear;

    // des_id কলাম দিয়ে District টেবিলের সাথে রিলেশন
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "des_id", referencedColumnName = "desid")
    @JsonBackReference
    private District district;
}
