package com.webtech.umuganda.config;

import com.webtech.umuganda.core.location.model.Locations;
import com.webtech.umuganda.core.location.repository.LocationRepository;
import com.webtech.umuganda.core.user.model.Users;
import com.webtech.umuganda.core.user.repository.UsersRepository;
import com.webtech.umuganda.util.enums.user.ERole;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UsersRepository usersRepository;
    private final LocationRepository locationRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            seedLocations();
            seedUsers();
        };
    }

    // ─────────────────────────────────────────────
    // LOCATION SEEDING — Rwanda Administrative Hierarchy
    // Province → District → Sector → Cell → Village
    // ─────────────────────────────────────────────

    private void seedLocations() {

        // ── PROVINCES ──
        Locations kigali = saveLocation("City of Kigali", "PROVINCE", "RW-01", null);
        Locations eastern = saveLocation("Eastern Province", "PROVINCE", "RW-02", null);
        Locations northern = saveLocation("Northern Province", "PROVINCE", "RW-03", null);
        Locations southern = saveLocation("Southern Province", "PROVINCE", "RW-04", null);
        Locations western = saveLocation("Western Province", "PROVINCE", "RW-05", null);

        // ── DISTRICTS — City of Kigali ──
        Locations gasabo = saveLocation("Gasabo", "DISTRICT", "RW-01-01", kigali);
        Locations kicukiro = saveLocation("Kicukiro", "DISTRICT", "RW-01-02", kigali);
        Locations nyarugenge = saveLocation("Nyarugenge", "DISTRICT", "RW-01-03", kigali);

        // ── DISTRICTS — Eastern Province ──
        Locations bugesera = saveLocation("Bugesera", "DISTRICT", "RW-02-01", eastern);
        Locations gatsibo = saveLocation("Gatsibo", "DISTRICT", "RW-02-02", eastern);
        Locations kayonza = saveLocation("Kayonza", "DISTRICT", "RW-02-03", eastern);
        Locations rwamagana = saveLocation("Rwamagana", "DISTRICT", "RW-02-04", eastern);

        // ── DISTRICTS — Northern Province ──
        Locations burera = saveLocation("Burera", "DISTRICT", "RW-03-01", northern);
        Locations gakenke = saveLocation("Gakenke", "DISTRICT", "RW-03-02", northern);
        Locations gicumbi = saveLocation("Gicumbi", "DISTRICT", "RW-03-03", northern);
        Locations musanze = saveLocation("Musanze", "DISTRICT", "RW-03-04", northern);

        // ── DISTRICTS — Southern Province ──
        Locations gisagara = saveLocation("Gisagara", "DISTRICT", "RW-04-01", southern);
        Locations huye = saveLocation("Huye", "DISTRICT", "RW-04-02", southern);
        Locations muhanga = saveLocation("Muhanga", "DISTRICT", "RW-04-03", southern);
        Locations nyanza = saveLocation("Nyanza", "DISTRICT", "RW-04-04", southern);

        // ── DISTRICTS — Western Province ──
        Locations karongi = saveLocation("Karongi", "DISTRICT", "RW-05-01", western);
        Locations rubavu = saveLocation("Rubavu", "DISTRICT", "RW-05-02", western);
        Locations rusizi = saveLocation("Rusizi", "DISTRICT", "RW-05-03", western);
        Locations nyamasheke = saveLocation("Nyamasheke", "DISTRICT", "RW-05-04", western);

        // ── SECTORS — Gasabo ──
        Locations kimironko = saveLocation("Kimironko", "SECTOR", "RW-01-01-01", gasabo);
        Locations remera = saveLocation("Remera", "SECTOR", "RW-01-01-02", gasabo);
        Locations kacyiru = saveLocation("Kacyiru", "SECTOR", "RW-01-01-03", gasabo);
        Locations jabana = saveLocation("Jabana", "SECTOR", "RW-01-01-04", gasabo);

        // ── SECTORS — Kicukiro ──
        Locations gatenga = saveLocation("Gatenga", "SECTOR", "RW-01-02-01", kicukiro);
        Locations gikondo = saveLocation("Gikondo", "SECTOR", "RW-01-02-02", kicukiro);
        Locations kagarama = saveLocation("Kagarama", "SECTOR", "RW-01-02-03", kicukiro);
        Locations niboye = saveLocation("Niboye", "SECTOR", "RW-01-02-04", kicukiro);

        // ── SECTORS — Nyarugenge ──
        Locations gitega = saveLocation("Gitega", "SECTOR", "RW-01-03-01", nyarugenge);
        Locations kiyovu = saveLocation("Kiyovu", "SECTOR", "RW-01-03-02", nyarugenge);
        Locations nyakabanda = saveLocation("Nyakabanda", "SECTOR", "RW-01-03-03", nyarugenge);

        // ── SECTORS — Musanze ──
        Locations muhoza = saveLocation("Muhoza", "SECTOR", "RW-03-04-01", musanze);
        Locations cyuve = saveLocation("Cyuve", "SECTOR", "RW-03-04-02", musanze);

        // ── SECTORS — Huye ──
        Locations ngoma = saveLocation("Ngoma", "SECTOR", "RW-04-02-01", huye);
        Locations tumba = saveLocation("Tumba", "SECTOR", "RW-04-02-02", huye);

        // ── SECTORS — Rubavu ──
        Locations gisenyi = saveLocation("Gisenyi", "SECTOR", "RW-05-02-01", rubavu);
        Locations rugerero = saveLocation("Rugerero", "SECTOR", "RW-05-02-02", rubavu);

        // ── CELLS — Kimironko ──
        Locations bibare = saveLocation("Bibare", "CELL", "RW-01-01-01-01", kimironko);
        Locations kibagabaga = saveLocation("Kibagabaga", "CELL", "RW-01-01-01-02", kimironko);
        Locations macterelo = saveLocation("Macterelo", "CELL", "RW-01-01-01-03", kimironko);

        // ── CELLS — Remera ──
        Locations nyabisindu = saveLocation("Nyabisindu", "CELL", "RW-01-01-02-01", remera);
        Locations rukiri = saveLocation("Rukiri", "CELL", "RW-01-01-02-02", remera);

        // ── CELLS — Kacyiru ──
        Locations kamatamu = saveLocation("Kamatamu", "CELL", "RW-01-01-03-01", kacyiru);
        Locations karuruma = saveLocation("Karuruma", "CELL", "RW-01-01-03-02", kacyiru);

        // ── CELLS — Gitega ──
        Locations akabahizi = saveLocation("Akabahizi", "CELL", "RW-01-03-01-01", gitega);
        Locations nyamirambo = saveLocation("Nyamirambo", "CELL", "RW-01-03-01-02", gitega);

        // ── CELLS — Muhoza ──
        Locations cyabararika = saveLocation("Cyabararika", "CELL", "RW-03-04-01-01", muhoza);
        Locations mpenge = saveLocation("Mpenge", "CELL", "RW-03-04-01-02", muhoza);

        // ── CELLS — Ngoma (Huye) ──
        Locations butare = saveLocation("Butare", "CELL", "RW-04-02-01-01", ngoma);
        Locations sovu = saveLocation("Sovu", "CELL", "RW-04-02-01-02", ngoma);

        // ── VILLAGES — Bibare / Kimironko ──
        Locations agakiriro = saveLocation("Agakiriro", "VILLAGE", "RW-01-01-01-01-01", bibare);
        Locations inshuti = saveLocation("Inshuti", "VILLAGE", "RW-01-01-01-01-02", bibare);

        // ── VILLAGES — Kibagabaga ──
        Locations igihozo = saveLocation("Igihozo", "VILLAGE", "RW-01-01-01-02-01", kibagabaga);
        Locations agasaro = saveLocation("Agasaro", "VILLAGE", "RW-01-01-01-02-02", kibagabaga);

        // ── VILLAGES — Nyabisindu / Remera ──
        Locations ubumwe = saveLocation("Ubumwe", "VILLAGE", "RW-01-01-02-01-01", nyabisindu);
        Locations amizero = saveLocation("Amizero", "VILLAGE", "RW-01-01-02-01-02", nyabisindu);

        // ── VILLAGES — Nyamirambo / Gitega ──
        Locations agateka = saveLocation("Agateka", "VILLAGE", "RW-01-03-01-02-01", nyamirambo);
        Locations kazungu = saveLocation("Kazungu", "VILLAGE", "RW-01-03-01-02-02", nyamirambo);

        // ── VILLAGES — Cyabararika / Muhoza ──
        Locations icyerekezo = saveLocation("Icyerekezo", "VILLAGE", "RW-03-04-01-01-01", cyabararika);
        Locations inzira = saveLocation("Inzira", "VILLAGE", "RW-03-04-01-01-02", cyabararika);

        // ── VILLAGES — Butare / Ngoma-Huye ──
        Locations gasharu = saveLocation("Gasharu", "VILLAGE", "RW-04-02-01-01-01", butare);
        Locations rugando = saveLocation("Rugando", "VILLAGE", "RW-04-02-01-01-02", butare);

        System.out.println("✅ Rwanda administrative locations seeded.");
    }

    private Locations saveLocation(String name, String type, String ref, Locations parent) {
        return locationRepository.findByRef(ref).orElseGet(() -> {
            Locations loc = new Locations();
            loc.setName(name);
            loc.setType(type);
            loc.setRef(ref);
            loc.setParent(parent);
            return locationRepository.save(loc);
        });
    }

    // ─────────────────────────────────────────────
    // USER SEEDING — Admin, Village Chiefs, Village Socials, Villagers
    // ─────────────────────────────────────────────

    private void seedUsers() {
        String defaultPassword = passwordEncoder.encode("123456");

        // ── ADMIN ──
        seedAdmin("mugaboandre@umuganda.rw", defaultPassword);

        // ── VILLAGE CHEFS (Local Leaders) ──
        seedUser("Jean", "Damascene", "jdamascene@umuganda.rw", "0780100001", ERole.VILLAGE_CHEF, "RW-01-01-01-01",
                defaultPassword);
        seedUser("Alice", "Uwamahoro", "auwamahoro@umuganda.rw", "0780100002", ERole.VILLAGE_CHEF, "RW-01-01-01-02",
                defaultPassword);
        seedUser("Emmanuel", "Nshimiyimana", "enshimi@umuganda.rw", "0780100003", ERole.VILLAGE_CHEF, "RW-01-01-02-01",
                defaultPassword);
        seedUser("Marie", "Uwizeyimana", "muwizey@umuganda.rw", "0780100004", ERole.VILLAGE_CHEF, "RW-01-03-01-02",
                defaultPassword);
        seedUser("Patrick", "Habimana", "phabimana@umuganda.rw", "0780100005", ERole.VILLAGE_CHEF, "RW-03-04-01-01",
                defaultPassword);
        seedUser("Claudine", "Mukamana", "cmukamana@umuganda.rw", "0780100006", ERole.VILLAGE_CHEF, "RW-04-02-01-01",
                defaultPassword);

        // ── VILLAGE SOCIALS ──
        seedUser("Ange", "Ingabire", "aingabire@umuganda.rw", "0780200001", ERole.VILLAGE_SOCIAL, "RW-01-01-01-01",
                defaultPassword);
        seedUser("Didier", "Nzeyimana", "dnzeyimana@umuganda.rw", "0780200002", ERole.VILLAGE_SOCIAL, "RW-01-01-01-02",
                defaultPassword);
        seedUser("Jeanne", "Dufatanye", "jdufatanye@umuganda.rw", "0780200003", ERole.VILLAGE_SOCIAL, "RW-01-01-02-01",
                defaultPassword);
        seedUser("Innocent", "Ndayishimiye", "indayi@umuganda.rw", "0780200004", ERole.VILLAGE_SOCIAL, "RW-03-04-01-01",
                defaultPassword);

        // ── VILLAGERS ──
        seedUser("Alain", "Mugisha", "amugisha@umuganda.rw", "0780300001", ERole.VILLAGER, "RW-01-01-01-01-01",
                defaultPassword);
        seedUser("Chantal", "Uwera", "cuwera@umuganda.rw", "0780300002", ERole.VILLAGER, "RW-01-01-01-01-02",
                defaultPassword);
        seedUser("Eric", "Hakizimana", "ehakizi@umuganda.rw", "0780300003", ERole.VILLAGER, "RW-01-01-01-02-01",
                defaultPassword);
        seedUser("Fatuma", "Niyonzima", "fniyonzima@umuganda.rw", "0780300004", ERole.VILLAGER, "RW-01-01-01-02-02",
                defaultPassword);
        seedUser("Gaspard", "Sendanyoye", "gsendanyoye@umuganda.rw", "0780300005", ERole.VILLAGER, "RW-01-01-02-01-01",
                defaultPassword);
        seedUser("Honorine", "Mukagasana", "hmukagasana@umuganda.rw", "0780300006", ERole.VILLAGER, "RW-01-01-02-01-02",
                defaultPassword);
        seedUser("Ibrahim", "Bakundukize", "ibakundu@umuganda.rw", "0780300007", ERole.VILLAGER, "RW-01-03-01-02-01",
                defaultPassword);
        seedUser("Joséphine", "Nkurunziza", "jnkurunziza@umuganda.rw", "0780300008", ERole.VILLAGER,
                "RW-01-03-01-02-02", defaultPassword);
        seedUser("Kevin", "Rudahunga", "krudahunga@umuganda.rw", "0780300009", ERole.VILLAGER, "RW-03-04-01-01-01",
                defaultPassword);
        seedUser("Laetitia", "Musabyimana", "lmusabyimana@umuganda.rw", "0780300010", ERole.VILLAGER,
                "RW-03-04-01-01-02", defaultPassword);
        seedUser("Marcel", "Niyonsenga", "mniyonsenga@umuganda.rw", "0780300011", ERole.VILLAGER, "RW-04-02-01-01-01",
                defaultPassword);
        seedUser("Nadine", "Uwimana", "nuwimana@umuganda.rw", "0780300012", ERole.VILLAGER, "RW-04-02-01-01-02",
                defaultPassword);

        System.out.println("✅ Test users seeded.");
    }

    private void seedAdmin(String email, String hashedPassword) {
        Users admin = usersRepository.findByEmail(email).orElseGet(Users::new);
        admin.setFirstName("Admin");
        admin.setLastName("System");
        admin.setEmail(email);
        admin.setPassword(hashedPassword);
        admin.setPhone("0780000000");
        admin.setRole(ERole.ADMIN);
        admin.setVerified(true);
        usersRepository.save(admin);
        System.out.println("✅ Admin synced: " + email);
    }

    private void seedUser(String firstName, String lastName, String email, String phone,
            ERole role, String locationRef, String hashedPassword) {

        Users user = usersRepository.findByEmail(email).orElseGet(Users::new);

        Locations location = locationRepository.findByRef(locationRef).orElse(null);

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(role);
        user.setPassword(hashedPassword);
        user.setVerified(true);
        user.setLocation(location);
        usersRepository.save(user);
    }
}
