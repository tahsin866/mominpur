package com.example.project.address.Model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Table(name = "district", schema = "public")
@Data
public class District {
    
@Id
    @Column(name = "desid")
    private Integer desId; // আপনার ইনসার্ট কুয়েরি অনুযায়ী desid-ই প্রাইমারি কি

    private Integer distserialno;
    private String desname;
    private String district;
    
    @Column(name = "username")
    private String userName;
    
    @Column(name = "entdate")
    private ZonedDateTime entDate;
    
    @Column(name = "entyear")
    private Integer entYear;

    // did কলাম দিয়ে Division টেবিলের সাথে রিলেশন
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "did", referencedColumnName = "id")
    @JsonBackReference
    private Division division;

    // এক জেলার অধীনে অনেক থানা থাকতে পারে
    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Thana> thanas;

}
