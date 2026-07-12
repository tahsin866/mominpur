package com.example.project.address.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "division")
@Data
public class Division {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dname;
    private String division;
    
    @Column(name = "username")
    private String userName;
    
    @Column(name = "entdate")
    private ZonedDateTime entDate;
    
    @Column(name = "entyear")
    private Integer entYear;

    @OneToMany(mappedBy = "division", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<District> districts;
}
