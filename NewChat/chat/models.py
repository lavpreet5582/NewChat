from django.db import models


class Channel(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField("accounts.User", related_name="channels")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.channel.name}"
