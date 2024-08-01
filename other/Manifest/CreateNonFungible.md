# Radix Manifest Examples

## Create Non Fungible Resource With Initial Supply

Optional address reservation:
```
ALLOCATE_GLOBAL_ADDRESS
    Address("Resource_Package_Global_Address")
    "NonFungibleResourceManager"
    AddressReservation("reservation1")
    NamedAddress("address1")
;
```
An address reservation can be very helpfull if the address of the token/nft to be generated is needed later in the same Manifest. i.e. for setting Roles.

```
CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
# 1.
    Enum<2u8>(
        Enum<0u8>()
    )
# 2.
    Enum<0u8>()
# 3.
    true
# 4.
    Enum<0u8>(
# 4.1
        Enum<0u8>(
            Tuple(
                Array<Enum>(
                    Enum<14u8>(
                        Array<Enum>(
                            Enum<0u8>(
                                12u8
                            ),
                            Enum<0u8>(
                                12u8
                            ),
                            Enum<0u8>(
                                198u8
                            )
                        )
                    )
                ),
                Array<Tuple>(
                    Tuple(
                        Enum<1u8>(
                            "MetadataStandardNonFungibleData"
                        ),
                        Enum<1u8>(
                            Enum<0u8>(
                                Array<String>(
                                    "name",
                                    "description",
                                    "key_image_url"
                                )
                            )
                        )
                    )
                ),
                Array<Enum>(
                    Enum<0u8>()
                )
            )
        ),
# 4.2
        Enum<1u8>(
            0u64
        ),
# 4.3
        Array<String>()
    )
# 5.
    Map<NonFungibleLocalId, Tuple>(
        NonFungibleLocalId("<uniquestring>") => Tuple(
            Tuple(
                "NFT Name",
                "description",
                "url to the key_image"
            )
        )
    )
# 6.
    Tuple(
        Enum<1u8>(
            Tuple(
                Enum<0u8>(),
                Enum<0u8>()
            )
        ),
        Enum<1u8>(
            Tuple(
                Enum<0u8>(),
                Enum<0u8>()
            )
        ),
        Enum<1u8>(
            Tuple(
                Enum<0u8>(),
                Enum<0u8>()
            )
        ),
        Enum<1u8>(
            Tuple(
                Enum<0u8>(),
                Enum<0u8>()
            )
        ),
        Enum<1u8>(
            Tuple(
                Enum<0u8>(),
                Enum<0u8>()
            )
        ),
        Enum<1u8>(
            Tuple(
                Enum<0u8>(),
                Enum<0u8>()
            )
        ),
        Enum<1u8>(
            Tuple(
                Enum<0u8>(),
                Enum<0u8>()
            )
        )
    )
# 7.
    Tuple(
        Map<String, Tuple>(
            "description" => Tuple(
                Enum<1u8>(
                    Enum<0u8>(
                        "NFT description"
                    )
                ),
                false
            ),
            "icon_url" => Tuple(
                Enum<1u8>(
                    Enum<13u8>(
                        "url to the icon"
                    )
                ),
                false
            ),
            "name" => Tuple(
                Enum<1u8>(
                    Enum<0u8>(
                        "TICKER"
                    )
                ),
                false
            ),
            "tags" => Tuple(
                Enum<1u8>(
                    Enum<128u8>(
                        Array<String>(
                            "example",
                            "nft",
                        )
                    )
                ),
                false
            ),
            "info_url" => Tuple(
                Enum<1u8>(
                    Enum<13u8>(
                        "for instance your homepage"
                    )
                ),
                false
            )
        ),
        Map<String, Enum>()
    )
# 8.
    Enum<1u8>(
        AddressReservation("reservation1")
    )
;
```
1.  Owner Role see the OwnerRole info file

2.  NFT type, valid Enum<0u8..3u8> are
    - NonFungibleIdType::String
    - NonFungibleIdType::Integer 
    - NonFungibleIdType::Bytes
    - NonFungibleIdType::RUID 

3. instruct the engine to keep track of the supply

4. Non-fungible data setup. There are three parts here:
- 4.1
    NFT data --> data buildup
    - kind of data
    - metadata
    - type validations

    Using the "reserved" word "key_image_url" will have this image shown in the wallet and on the dashboard.</br>
    The 12u8 is the int value to represent a string.</br>
    The 198u8 is the int value to represent a url.<br>
    <b>ToDo:</b> need a list of valid Enum's!<br>
- 4.2 NFT Scema data type
- 4.3 Mutable Fields

5. Initial supply.<br> For each entry the values as defined in the sceme setup can be entered.

6. Resource Roles<br>
These setting determine who as the rights to:
    - mint
    - burn
    - freeze
    - recall
    - withdraw
    - deposit
    - update NFT data

7. NFT MetaData<br>
Valid for the collection, using the correct reserved names here will set you collections icon/name description etc.<br> There are two secions here (init/roles) The roles describe who is allowed to set/update metadata and change the roles of the metadata-setter-updater, if not defined it will default to the Owner.<br>
<b>ToDo:</b> need a list of valid Enum's!<br>

8. Either use the SOME[address reservation] here or set to None, or their equivalent Enums.<br>  

<b>note:</b><br>If the NFT is to be its own owner, for example roles like withdraw and deposit are restricted owner roles, the NFT can better be created with the following owner role setting:
- OwnerRole::Updatable --> AccessRule::AllowAll<br>

The address reservation only reserves the resource address, but the NFT-id might be needed fo the (Owner)Role(s). It's easier to update the (Owner)Role(s) once the NFT exist.