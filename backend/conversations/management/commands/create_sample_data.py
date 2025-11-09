"""
Management command to create sample conversation data for testing.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from conversations.models import Conversation, Message
from datetime import timedelta


class Command(BaseCommand):
    help = 'Creates sample conversation data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample conversations...')

        # Sample Conversation 1: Travel Planning
        conv1 = Conversation.objects.create(
            title='Travel Planning to Japan',
            status='ended',
            start_timestamp=timezone.now() - timedelta(days=7),
            end_timestamp=timezone.now() - timedelta(days=7, hours=-1),
            summary='Discussion about planning a trip to Japan, including must-visit places in Tokyo and Kyoto, cultural tips, and itinerary suggestions.',
            key_topics=['travel', 'japan', 'tokyo', 'kyoto', 'tourism'],
            sentiment='positive',
            action_items=['Research Tokyo attractions', 'Plan 7-day itinerary', 'Book flights']
        )

        Message.objects.create(
            conversation=conv1,
            content='I\'m planning a trip to Japan. Can you help me?',
            sender='user',
            timestamp=timezone.now() - timedelta(days=7)
        )
        Message.objects.create(
            conversation=conv1,
            content='Absolutely! I\'d be happy to help you plan your trip to Japan. What would you like to know?',
            sender='ai',
            timestamp=timezone.now() - timedelta(days=7, minutes=1)
        )
        Message.objects.create(
            conversation=conv1,
            content='What are the must-visit places in Tokyo?',
            sender='user',
            timestamp=timezone.now() - timedelta(days=7, minutes=2)
        )
        Message.objects.create(
            conversation=conv1,
            content='Tokyo has many amazing places! Some must-visits include: Senso-ji Temple in Asakusa, Shibuya Crossing, Tokyo Skytree, Meiji Shrine, and the Tsukiji Fish Market. Each offers a unique cultural experience.',
            sender='ai',
            timestamp=timezone.now() - timedelta(days=7, minutes=3)
        )

        # Sample Conversation 2: Technical Discussion
        conv2 = Conversation.objects.create(
            title='Django Authentication Implementation',
            status='ended',
            start_timestamp=timezone.now() - timedelta(days=5),
            end_timestamp=timezone.now() - timedelta(days=5, hours=-1),
            summary='Technical discussion about implementing authentication in Django, covering JWT tokens, session-based auth, and best practices.',
            key_topics=['django', 'authentication', 'jwt', 'web development', 'python'],
            sentiment='neutral',
            action_items=['Implement JWT authentication', 'Review Django documentation', 'Set up user models']
        )

        Message.objects.create(
            conversation=conv2,
            content='How do I implement authentication in Django?',
            sender='user',
            timestamp=timezone.now() - timedelta(days=5)
        )
        Message.objects.create(
            conversation=conv2,
            content='Django provides several ways to implement authentication. The built-in django.contrib.auth offers user management, login, logout, and password reset. For REST APIs, you can use django-rest-framework with TokenAuthentication or SessionAuthentication.',
            sender='ai',
            timestamp=timezone.now() - timedelta(days=5, minutes=1)
        )
        Message.objects.create(
            conversation=conv2,
            content='What about JWT tokens?',
            sender='user',
            timestamp=timezone.now() - timedelta(days=5, minutes=2)
        )
        Message.objects.create(
            conversation=conv2,
            content='For JWT tokens, you can use django-rest-framework-simplejwt. Install it with pip, add it to INSTALLED_APPS, configure the authentication classes, and set up token endpoints. JWT is stateless and great for mobile apps and SPAs.',
            sender='ai',
            timestamp=timezone.now() - timedelta(days=5, minutes=3)
        )

        # Sample Conversation 3: Active Conversation
        conv3 = Conversation.objects.create(
            title='Cooking Tips',
            status='active',
            start_timestamp=timezone.now() - timedelta(hours=2)
        )

        Message.objects.create(
            conversation=conv3,
            content='Can you give me some cooking tips?',
            sender='user',
            timestamp=timezone.now() - timedelta(hours=2)
        )
        Message.objects.create(
            conversation=conv3,
            content='Of course! Here are some essential cooking tips: 1) Always prep your ingredients before you start cooking (mise en place), 2) Use sharp knives for safety and efficiency, 3) Taste as you go, 4) Don\'t overcrowd the pan, and 5) Let meat rest after cooking. What type of cuisine are you interested in?',
            sender='ai',
            timestamp=timezone.now() - timedelta(hours=2, minutes=1)
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {Conversation.objects.count()} conversations with sample data!'
            )
        )

