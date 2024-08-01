# Radix Manifest Examples

## Create Account Advanced

Optional address reservation:
```
ALLOCATE_GLOBAL_ADDRESS
    Address("Resource_Package_Global_Address")
    "NonFungibleResourceManager"
    AddressReservation("reservation1")
    NamedAddress("address1")
;
```
An address reservation can be very helpfull if the address of the account will receive a deposit in the same Manifest.

```
CREATE_ACCOUNT_ADVANCED
# 1.
    Enum<2u8>(
        Enum<0u8>()
    )
# 2.
    Enum<1u8>(
        AddressReservation("reservation1")
    )

;
```
1.  Owner Role see the OwnerRole info file

2. Either use the <b>Some</b>("address reservation") here or set to <b>None</b>, or their equivalent Enums.<br>  

