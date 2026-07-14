package com.example.project.address.Controller;

import com.example.project.address.Model.Division;
import com.example.project.address.Service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/location")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class LocationController {
    
    @Autowired
    private LocationService locationService;

    @GetMapping("/divisions")
    public ResponseEntity<List<Division>> getDivisions() {
        List<Division> divisions = locationService.getAllDivisionsWithDetails();
        return ResponseEntity.ok(divisions);
    }
}
