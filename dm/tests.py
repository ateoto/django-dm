from django.contrib.auth.models import User
from tastypie.test import ResourceTestCase, TestApiClient

from dm.models import EncounterParticipant


class EncounterParticipantResourceTest(ResourceTestCase):
    fixtures = ['testing_users.json', 'testing_data.json']

    def setUp(self):
        super(EncounterParticipantResourceTest, self).setUp()
        self.api_client = TestApiClient()

        self.username = 'SuperUser'
        self.password = 'FakePass'
        self.user = User.objects.create_superuser(self.username, 'superuser@example.com', self.password)

        self.encounter_participant = EncounterParticipant.objects.get(id=1)

    def get_credentials(self):
        return self.api_client.client.login(username=self.username,
                                            password=self.password)

    def test_pc_initiative_save_unauthenticated(self):
        self.assertHttpUnauthorized(self.api_client.patch('/dm/api/v1/encounter_participant/1/',
                                        format='json', data={'initiative': 5}))

    def test_pc_initiative_save(self):
        """
        Should save initiative for PC
        """
        resp = self.api_client.patch('/dm/api/v1/encounter_participant/1/',
                                        authorization=self.get_credentials(),
                                        format='json', data={'initiative': 5})

        self.assertHttpAccepted(resp)

        resp = self.api_client.get('/dm/api/v1/encounter_participant/1/',
                                    format='json',
                                    authentication=self.get_credentials())

        self.assertEqual(self.deserialize(resp)['initiative'], 5)
