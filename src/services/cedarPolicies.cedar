// ==============================================================================
// SMRT Kiosk — AWS Cedar Policy Definitions (Open Source Build It Module)
// ==============================================================================
// Policy 1: Hazmat Safety Restriction
// Forbid standard kiosk pods from accepting swollen lithium batteries.
// Only pods with `hazmatCertified == true` and active sand isolation cells are permitted.
forbid (
    principal,
    action == Action::"ReserveLocker",
    resource is Kiosk
)
when {
    context.deviceCondition == "swollen_battery" &&
    !resource.hazmatCertified
};

// Policy 2: General Student Drop-off Locker Allocation
// Permit verified student drop-offs when locker capacity is available.
permit (
    principal is Student,
    action in [Action::"ReserveLocker", Action::"GeneratePass"],
    resource is Kiosk
)
when {
    resource.status == "online" &&
    resource.availableLockerSlots > 0
};

// Policy 3: Kiosk Operator Terminal Hardware Verification
// Lead lab tech / authorized custodian can unlock and audit receiving lockers.
permit (
    principal is Operator,
    action in [Action::"UnlockLocker", Action::"VerifyHardware", Action::"CompleteTriage"],
    resource is Kiosk
)
when {
    principal.assignedCampus == resource.campusId
};
