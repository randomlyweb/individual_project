from django.contrib import admin

from .models import *


class BlockAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__')

admin.site.register(Block, BlockAdmin)
admin.site.register(Blockchain)