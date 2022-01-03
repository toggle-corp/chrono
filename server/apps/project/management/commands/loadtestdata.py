from django.core.management.base import BaseCommand
from user.factories import UserFactory
from user_group.factories import UserGroupFactory
from project.factories import ProjectFactory, TagFactory
from task.factories import TaskFactory, TimeSlotFactory


class Command(BaseCommand):
    help = 'Init test data'

    def handle(self, *args, **options):
        # ----------------------------------------------------
        # Create user groups
        # ----------------------------------------------------
        user_groups = UserGroupFactory.create_batch(4)
        total_user_groups = len(user_groups)
        self.stdout.write(self.style.SUCCESS(f'User groups created => {total_user_groups}'))

        # ----------------------------------------------------
        # Create users and group members associations
        # ----------------------------------------------------
        total_users = 0
        for group in user_groups:
            user = UserFactory.create()
            total_users = total_users + 1
            group.members.add(user)
        self.stdout.write(self.style.SUCCESS(f'Users created => {total_users}'))

        # ----------------------------------------------------
        # Create projects
        # ----------------------------------------------------
        projects = ProjectFactory.create_batch(30)
        total_projects = len(projects)
        self.stdout.write(self.style.SUCCESS(f'Project created => {total_projects}'))

        # ----------------------------------------------------
        # Create tags for each project chunk
        # ----------------------------------------------------

        total_tags = 0
        for project in projects:
            TagFactory.create(project=project)
            total_tags = total_tags + 1
        self.stdout.write(self.style.SUCCESS(f'Tags created => {total_tags}'))

        # ----------------------------------------------------
        # Create n tasks for each project
        # ----------------------------------------------------
        total_tasks = 0
        tasks = []
        for project in projects:
            for i in range(3):
                task = TaskFactory.create(project=project)
                task.tags.set(project.tags.all())
                tasks.append(task)
        total_tasks = len(tasks)
        self.stdout.write(self.style.SUCCESS(f'Task created => {total_tasks}'))

        # ----------------------------------------------------
        # Create n timeslots for each task
        # ----------------------------------------------------
        total_timeslots = 0
        for task in tasks:
            for i in range(3):
                timeslot = TimeSlotFactory.create(task=task)
                timeslot.tags.set(task.tags.all())
                total_timeslots = total_timeslots + 1
        self.stdout.write(self.style.SUCCESS(f'Time slots created => {total_timeslots}'))
