import graphene
from user import schema as user_schema, mutations as user_mutations


# chrono schemas
class Query(user_schema.Query, graphene.ObjectType):
    pass


# chrono mutations
class Mutation(user_mutations.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
