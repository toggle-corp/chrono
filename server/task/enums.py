from utils.graphene.enums import (
    convert_enum_to_graphene_enum,
    get_enum_name_from_django_field,
)
from .models import TimeSlot


TimeSlotGroupByEnum = convert_enum_to_graphene_enum(TimeSlot.GroupBy, name='TimeSlotGroupByEnum')

enum_map = {
    get_enum_name_from_django_field(
        None,
        field_name='group_by',
        model_name=TimeSlot.__name__,
    ): TimeSlotGroupByEnum,
}
